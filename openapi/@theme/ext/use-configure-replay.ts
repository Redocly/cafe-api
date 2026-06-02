import { useEffect, useState, useCallback, useRef } from 'react';

import type {
  ConfigureRequestValues,
  ConfigureServerRequestValues,
} from '@redocly/theme/ext/configure';
import type { UserClaims, OpenAPIServer, OpenAPIInfo } from '@redocly/theme/core/types';

type ContextProps = {
  operation: {
    name: string;
    path: string;
    operationId: string;
    href: string;
    method: string;
  };
  info: OpenAPIInfo;
  servers: OpenAPIServer[];
  userClaims: UserClaims;
};

const SCOPES = ['menu:read', 'menu:write', 'orders:read', 'orders:write'];
const BASE_URL = 'https://cafe.cloud.redocly.com';
const CLIENT_NAME = 'auth';

async function getReplayConfiguration(
  _context: ContextProps,
): Promise<ConfigureRequestValues | ConfigureServerRequestValues | null> {
  const registerResponse = await fetch(`${BASE_URL}/oauth2/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: CLIENT_NAME,
      redirectUris: [`${BASE_URL}/callback`],
      scopes: SCOPES,
      grantTypes: ['client_credentials'],
    }),
  });

  if (!registerResponse.ok) {
    throw new Error(`Client registration failed with status ${registerResponse.status}`);
  }

  const { clientId, clientSecret } = await registerResponse.json();

  const tokenResponse = await fetch(`${BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: SCOPES.join(' '),
    }).toString(),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Token request failed with status ${tokenResponse.status}`);
  }

  const { access_token, token_type } = await tokenResponse.json();

  return {
    // Exposes the token as a Try it environment variable so request fields can
    // reference it via {$inputs.OAuth2_token} across operations on the page.
    envVariables: {
      OAuth2_token: access_token,
    },
    security: {
      OAuth2: {
        client_id: clientId,
        client_secret: clientSecret,
        token: {
          access_token,
          token_type: token_type ?? 'Bearer',
        },
      },
    },
  };
}

export function useConfigureReplay(context: ContextProps, isOpened: boolean) {
  const [config, setConfig] = useState<
    ConfigureRequestValues | ConfigureServerRequestValues | null
  >(null);
  const contextRef = useRef(context);
  contextRef.current = context;

  const refresh = useCallback(async () => {
    const currentContext = contextRef.current;
    try {
      const result = await getReplayConfiguration(currentContext);
      setConfig(result);
    } catch (error) {
      console.warn(
        'Failed to configure replay for operation:',
        currentContext.operation.operationId,
        error,
      );
    }
  }, []);

  useEffect(() => {
    if (isOpened) {
      refresh();
    }
  }, [isOpened, refresh]);

  return { config, refresh };
}
