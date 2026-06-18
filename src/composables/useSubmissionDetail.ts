import { ref } from "vue";
import type { ProblemSubmitVO } from "../../generated";

/**
 * Frontend-only bridge for the "view submission detail" flow.
 *
 * The backend exposes no "get submission by id" endpoint, but the submission
 * list already returns the full record (including the submitted `code`).
 * So instead of re-fetching, the list page stashes the selected record here
 * and the detail page reads it. A hard page refresh clears this state; the
 * detail page handles that by redirecting back to the submission list.
 */
const selectedSubmission = ref<ProblemSubmitVO>();

export const useSubmissionDetail = () => {
  const setSubmission = (submission: ProblemSubmitVO) => {
    selectedSubmission.value = submission;
  };

  const clearSubmission = () => {
    selectedSubmission.value = undefined;
  };

  return { selectedSubmission, setSubmission, clearSubmission };
};
