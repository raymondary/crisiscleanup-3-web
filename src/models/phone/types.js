// @flow

/**
 * Phone model type definitions.
 */

import { AgentStates, RouteStates } from '@/models/phone/AgentClient';
import { ConnectionStates } from '@/models/phone/Connection';
import { ContactStates, ContactActions } from '@/models/phone/Contact';

type AgentState = $Values<typeof AgentStates>;
type RouteState = $Values<typeof RouteStates>;
type ConnectionState = $Values<typeof ConnectionStates>;
type ContactState = $Values<typeof ContactStates>;
type ContactAction = $Values<typeof ContactActions>;


type ConnectionType = {|
  connectionId: string,
  contactId: string,
  state: ConnectionState,
  // duration: number
|};

type ContactType = {|
  contactId: string,
  agentId: string,
  state: ContactState,
  action: ContactAction,
  connection: ConnectionType
|};


type AgentClientType = {|
  userId: number,
  agentId: string,
  state: AgentState,
  routeState: RouteState,
  contacts: ContactType[],
  connections: ConnectionType[],
|};

export type {
  AgentState,
  RouteState,
  ConnectionState,
  ContactState,
  ContactAction,
  AgentClientType,
  ContactType,
  ConnectionType,
};