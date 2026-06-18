<template>
  <div id="viewSubmissionView">
    <section class="d-panel d-reg work-panel">
      <header class="d-panel__head">
        <div class="d-panel__title">
          <span class="d-label">Submission</span>
          <span class="d-code">#{{ submission?.id ?? "—" }}</span>
        </div>
        <a-space :size="8">
          <a-button size="small" @click="copyCode">Copy code</a-button>
          <a-button size="small" type="text" @click="goBack">
            <template #icon><icon-close /></template>
            Close
          </a-button>
        </a-space>
      </header>

      <div class="d-panel__body">
        <div class="meta-row">
          <span class="meta-item d-code">
            PROBLEM #{{ submission?.problemId ?? "—" }}
          </span>
          <span class="meta-item d-code">
            {{ submission?.language || "—" }}
          </span>
          <span class="meta-item d-code" :style="{ color: verdictColor }">
            <span
              class="status-dot"
              :style="{ backgroundColor: verdictColor }"
            />
            {{ verdict }}
          </span>
          <span
            v-if="submission?.judgeInfo?.time != null"
            class="meta-item d-code"
          >
            TIME {{ submission?.judgeInfo?.time }}ms
          </span>
          <span
            v-if="submission?.judgeInfo?.memory != null"
            class="meta-item d-code"
          >
            MEM {{ submission?.judgeInfo?.memory }}KB
          </span>
        </div>
      </div>

      <div class="editor-wrap">
        <CodeEditor
          :value="submission?.code || ''"
          :language="submission?.language || 'java'"
          :readonly="true"
          :handle-change="noop"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import message from "@arco-design/web-vue/es/message";
import { IconClose } from "@arco-design/web-vue/es/icon";
import CodeEditor from "@/components/CodeEditor.vue";
import { useSubmissionDetail } from "@/composables/useSubmissionDetail";

const router = useRouter();
const { selectedSubmission } = useSubmissionDetail();

const submission = computed(() => selectedSubmission.value);

/**
 * Map the numeric submission status to a readable verdict.
 * 0-pending, 1-processing, 2-success/judged, 3-fail.
 */
const STATUS_MAP: Record<number, { text: string; dot: string }> = {
  0: { text: "Pending", dot: "#86909c" },
  1: { text: "Processing", dot: "#3491fa" },
  2: { text: "Judged", dot: "#00b42a" },
  3: { text: "Failed", dot: "#f53f3f" },
};

const status = computed(
  () =>
    STATUS_MAP[submission.value?.status ?? -1] ?? {
      text: "Unknown",
      dot: "#86909c",
    }
);

/**
 * When judging finished, prefer the concrete judge message (e.g. "Accepted").
 */
const verdict = computed(() => {
  if (submission.value?.status === 2 && submission.value?.judgeInfo?.message) {
    return submission.value.judgeInfo.message;
  }
  return status.value.text;
});

/**
 * Color for the verdict label/dot. For finished judging (status 2) the color
 * depends on the actual judge message: "Accepted" is green, any other verdict
 * (Wrong Answer, Time Limit Exceeded, etc.) is red.
 */
const verdictColor = computed(() => {
  switch (submission.value?.status) {
    case 0:
      return "#86909c"; // pending
    case 1:
      return "#3491fa"; // processing
    case 3:
      return "#f53f3f"; // failed
    case 2:
      return submission.value?.judgeInfo?.message === "Accepted"
        ? "#00b42a" // accepted
        : "#f53f3f"; // wrong answer / other verdicts
    default:
      return "#86909c";
  }
});

const noop = () => {
  // read-only editor never emits changes
};

const copyCode = async () => {
  const code = submission.value?.code ?? "";
  try {
    await navigator.clipboard.writeText(code);
    message.success("Code copied to clipboard");
  } catch {
    message.error("Copy failed — your browser blocked clipboard access");
  }
};

const goBack = () => {
  router.push({ path: "/problem_submit" });
};

/**
 * No "get submission by id" API exists, so this page relies on the record
 * stashed by the list page. If it is missing (e.g. a hard refresh), send the
 * visitor back to the submission list rather than showing an empty view.
 */
onMounted(() => {
  if (!selectedSubmission.value) {
    message.warning("Open a submission from the list to view its detail");
    router.replace({ path: "/problem_submit" });
  }
});
</script>

<style scoped>
#viewSubmissionView {
  max-width: 1280px;
  margin: 0 auto;
}

#viewSubmissionView .editor-wrap {
  border-top: 1px solid var(--d-line);
}

#viewSubmissionView .meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--d-space-2);
}

#viewSubmissionView .meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
  border: 1px solid var(--d-line);
  border-radius: var(--d-radius);
  padding: 4px var(--d-space-2);
  background: var(--d-bg);
}

#viewSubmissionView .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
