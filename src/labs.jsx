import React from 'react';
import {GitLab,ApiLab,DbLab} from './labs-foundation';
import {DockerLab,ArchLab} from './labs-system';
import {RagLab,AgentLab,EvalLab} from './labs-ai';
export function Lab({id,day}){const labs={git:GitLab,api:ApiLab,db:DbLab,docker:DockerLab,arch:ArchLab,rag:RagLab,agent:AgentLab,eval:EvalLab};const Component=labs[id];return <Component day={day}/>}
