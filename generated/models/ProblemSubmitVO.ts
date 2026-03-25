/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JudgeInfo } from './JudgeInfo';
import type { ProblemVO } from './ProblemVO';
import type { UserVO } from './UserVO';
export type ProblemSubmitVO = {
    code?: string;
    createTime?: string;
    id?: number;
    judgeInfo?: JudgeInfo;
    language?: string;
    problemId?: number;
    problemVO?: ProblemVO;
    status?: number;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
};

