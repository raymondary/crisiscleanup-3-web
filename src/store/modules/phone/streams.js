// @flow

/**
 * Phone ACS Streams Store
 */

import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import type { AuthState } from '@/store/modules/phone/types';
import * as ACS from '@/services/connect.service';
import Logger from '@/utils/log';
import * as SSO from '@/services/sso.service';
import type { ACSAgentEvent, ACSCoreEvent } from '@/services/types';
import type {
  AgentClientType,
  AgentState,
  RouteState,
} from '@/models/phone/types';
import AgentClient, {
  AgentStates,
  RouteStates,
} from '@/models/phone/AgentClient';

/**
 * Enum of different Connect authentication states.
 * @type {*|{IN_PROGRESS: string, SUCCESS: string, FAIL: string}}
 */
export const AuthStates = Object.freeze({
  FAIL: 'unauthenticated',
  SUCCESS: 'authenticated',
  IN_PROGRESS: 'in_progress',
  ERROR: 'error',
});

const Log = Logger({ name: 'phone.streams' });

@Module({
  name: 'phone/streams',
  persist: false,
  namespaced: true,
})
class StreamsStore extends VuexModule {
  // streams socket connection status
  connected: boolean = false;

  // streams authentication status
  authed: AuthState = AuthStates.FAIL;

  // agent id
  agentId: string | null = null;

  get agentClientId(): string | null {
    return this.agentId ? this.agentId : null;
  }

  @Mutation
  setConnected(isConnected: boolean) {
    this.connected = isConnected;
  }

  @Mutation
  setAuthed(authState: AuthState) {
    this.authed = authState;
  }

  @Mutation
  setAgentId(agentId: string) {
    this.agentId = agentId;
  }

  @Action
  async createClient(agent: connect.Agent) {
    const agentState = agent.getState().type;
    const isOnline: AgentState = AgentClient.isStateOnline(agentState);

    const agentAvail = agent.getState().name;
    const isRoutable: RouteState = isOnline
      ? AgentClient.isStateRoutable(agentAvail)
      : RouteStates.NOT_ROUTABLE;

    const {
      routingProfile: { queues },
    } = agent.getConfiguration();
    const agentQueue = queues.find((q) => q.queueId.includes('agent'));
    const agentId: string = agentQueue.queueId.split('agent/').pop();
    const agentClient: AgentClientType = {
      agentId,
      userId: this.context.rootGetters['auth/userId'],
      state: isOnline,
      routeState: isRoutable,
      contacts: [],
      connections: [],
    };
    Log.debug('Creating new agent client: ', agentClient);
    await AgentClient.create({ data: agentClient });
    this.context.commit('setAgentId', agentId);
  }

  @Action
  async updateAgentClient(newData: $Shape<AgentClientType>) {
    Log.debug('agent client update:', newData);
    await AgentClient.update({
      where: this.agentClientId,
      data: newData,
    });
  }

  @Action
  async init({ element }: { element: HTMLElement }) {
    Log.info('Initializing ACS streams store!');
    const ssoPortalUrl: string = await SSO.authenticate(
      this.context.rootGetters['auth/userToken'],
    );
    ACS.initConnect({
      htmlEl: element,
      config: { loginUrl: ssoPortalUrl },
    });
    // Bind core events
    ACS.bindEvents<ACSCoreEvent>(ACS.EventTopics.CORE, {
      [ACS.CoreEvents.ON_AUTH_FAIL]: () => {
        Log.warn('Connect authentication failed!');
        this.context.commit('setAuthed', AuthStates.FAIL);
      },
    });
    // Bind agent events
    ACS.bindEvents<ACSAgentEvent>(ACS.EventTopics.AGENT, {
      [ACS.AgentEvents.ON_CONNECTION_GAINED]: (agent: connect.Agent) => {
        Log.info('ACS successfully connected!');
        this.createClient(agent).then(() => {
          this.context.commit('setConnected', true);
        });
      },
      [ACS.AgentEvents.ON_CONNECTION_LOST]: () => {
        Log.warn('ACS lost connection!');
        this.context.commit('setConnected', false);
        this.context.commit('setAuthed', AuthStates.SUCCESS);
      },
      [ACS.AgentEvents.ON_ROUTABLE]: () => {
        this.updateAgentClient({
          state: AgentStates.ONLINE,
          routeState: RouteStates.ROUTABLE,
        }).then(() => {
          Log.debug('Agent Client => ROUTABLE');
        });
      },
      [ACS.AgentEvents.ON_NOT_ROUTABLE]: () => {
        this.updateAgentClient({ routeState: RouteStates.NOT_ROUTABLE }).then(
          () => {
            Log.debug('Agent Client => NOT_ROUTABLE');
          },
        );
      },
      [ACS.AgentEvents.ON_OFFLINE]: () => {
        this.updateAgentClient({
          routeState: RouteStates.NOT_ROUTABLE,
          state: AgentStates.OFFLINE,
        }).then(() => {
          Log.debug('Agent Client => OFFLINE');
        });
      },
    });
  }
}

export default StreamsStore;