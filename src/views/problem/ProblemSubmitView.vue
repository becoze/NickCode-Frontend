<template>
  <div id="problemSubmitView">
    <section class="d-panel d-reg">
      <header class="d-panel__head">
        <div class="d-panel__title">
          <span class="d-label">Submissions</span>
          <span class="d-code">LOG // JUDGE</span>
        </div>
        <span class="d-code">TOTAL: {{ total }}</span>
      </header>

      <div class="d-panel__body">
        <a-form :model="searchParams" layout="inline" class="search-bar">
          <a-form-item
            field="problem id"
            label="Search problem id"
            style="min-width: 360px"
          >
            <a-input v-model="searchParams.problemId" />
          </a-form-item>
          <a-form-item
            field="language"
            label="Search language"
            style="min-width: 100px"
          >
            <a-select
              v-model="searchParams.language"
              :style="{ width: '100px' }"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="doSubmit">Search</a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="clearSearch">Clear search</a-button>
          </a-form-item>
        </a-form>

        <a-table
          :columns="columns"
          :data="dataList"
          :pagination="{
            showTotal: true,
            pageSize: searchParams.pageSize,
            current: searchParams.current,
            total,
          }"
          @page-change="onPageChange"
        >
          <template #problemId="{ record }">
            <div class="problem-cell">
              <span class="problem-cell__title">{{
                problemTitle(record)
              }}</span>
              <span class="id-cell">{{ record.problemId }}</span>
            </div>
          </template>
          <template #detail="{ record }">
            <a-button size="small" @click="viewDetail(record)"
              >View detail</a-button
            >
          </template>
          <template #createTime="{ record }">
            <div class="submitted-cell">
              <span class="d-mono-cell">{{
                moment(record.createTime).format("hh:mm a, DD-MMM-YYYY")
              }}</span>
              <span class="id-cell">{{ record.id }}</span>
            </div>
          </template>
          <template #result="{ record }">
            <div class="judge-info">
              <!-- Finished judging: show the judge verdict (Accepted=green, others=red). -->
              <template v-if="record.status === 2">
                <a-tag
                  :color="
                    record.judgeInfo && record.judgeInfo.message === 'Accepted'
                      ? 'green'
                      : 'red'
                  "
                  size="small"
                  >{{
                    (record.judgeInfo && record.judgeInfo.message) || "Unknown"
                  }}</a-tag
                >
                <div
                  v-if="
                    record.judgeInfo &&
                    (record.judgeInfo.time != null ||
                      record.judgeInfo.memory != null)
                  "
                  class="judge-info__metrics d-mono-cell"
                >
                  <span v-if="record.judgeInfo.time != null">
                    {{ record.judgeInfo.time }} ms
                  </span>
                  <span v-if="record.judgeInfo.memory != null">
                    {{ record.judgeInfo.memory }} KB
                  </span>
                </div>
              </template>
              <!-- Still in the pipeline or failed: show the submission status. -->
              <div v-else class="judge-info__row">
                <span
                  class="judge-info__dot"
                  :style="{ backgroundColor: getStatus(record.status).dot }"
                />
                <a-tag :color="getStatus(record.status).color" size="small">{{
                  getStatus(record.status).text
                }}</a-tag>
              </div>
            </div>
          </template>
        </a-table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Problem,
  ProblemControllerService,
  ProblemSubmitQueryRequest,
  ProblemSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import { useSubmissionDetail } from "@/composables/useSubmissionDetail";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<ProblemSubmitQueryRequest>({
  problemId: undefined,
  language: undefined,
  pageSize: 15, // matched with backend "long pageSize"
  current: 1, // matched with backend "long current"
});
// Cache of problemId -> problem title. Submissions only carry problemId, so we
// resolve names via the existing problem VO endpoint and reuse across pages.
const problemTitleMap = ref<Record<number, string>>({});

const problemTitle = (record: ProblemSubmitVO) =>
  record.problemVO?.title ||
  problemTitleMap.value[record.problemId as number] ||
  "—";

const loadProblemTitles = async (records: ProblemSubmitVO[]) => {
  const ids = Array.from(
    new Set(
      records
        .filter((r) => !r.problemVO?.title && r.problemId != null)
        .map((r) => r.problemId as number)
    )
  ).filter((id) => !(id in problemTitleMap.value));

  await Promise.all(
    ids.map(async (id) => {
      const res = await ProblemControllerService.getProblemVoByIdUsingGet(id);
      if (res.code === 0 && res.data) {
        problemTitleMap.value[id] = res.data.title ?? "";
      }
    })
  );
};

const loadData = async () => {
  const res = await ProblemControllerService.listProblemSubmitByPageUsingPost({
    ...searchParams.value,
    sortField: "createTime",
    sortOrder: "desc",
  });
  // TODO show only my own submission (now is showing everything)
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    loadProblemTitles(res.data.records);
  } else {
    message.error("Data Load Error " + res.message);
  }
};

const defaultSearchParams = {
  title: "",
  tags: [],
  pageSize: 15,
  current: 1,
};
/**
 * monitor searchParams change and do loadData()
 */
watchEffect(() => {
  loadData();
});

/**
 * Load event
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "Problem",
    dataIndex: "problemId",
    slotName: "problemId",
  },
  {
    title: "Language",
    dataIndex: "language",
  },
  {
    title: "Result",
    dataIndex: "status",
    slotName: "result",
    // TODO refresh status every 10 seconds
  },
  {
    title: "Submitted",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "Detail",
    slotName: "detail",
  },
];

/**
 * Map the numeric submission status to a readable label, color and dot.
 * 0-pending, 1-processing, 2-success, 3-fail.
 */
const STATUS_MAP: Record<number, { text: string; color: string; dot: string }> =
  {
    0: { text: "Pending", color: "gray", dot: "#86909c" },
    1: { text: "Processing", color: "arcoblue", dot: "#3491fa" },
    2: { text: "Success", color: "green", dot: "#00b42a" },
    3: { text: "Failed", color: "red", dot: "#f53f3f" },
  };

const getStatus = (status: number) =>
  STATUS_MAP[status] ?? { text: "Unknown", color: "gray", dot: "#86909c" };

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * Redirect to Problem page
 * @param problem
 */
const router = useRouter();

const toProblemPage = (problem: Problem) => {
  router.push({
    path: `/view/problem/${problem.id}`,
  });
};

/**
 * Open the read-only detail view for a submission. The full record (including
 * the submitted code) is already loaded in the list, so we stash it for the
 * detail page instead of re-fetching (no get-by-id API exists).
 */
const { setSubmission } = useSubmissionDetail();

const viewDetail = (record: ProblemSubmitVO) => {
  setSubmission(record);
  router.push({
    path: `/view/submission/${record.id}`,
  });
};

const doSubmit = () => {
  // reset page to 1
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

const clearSearch = () => {
  searchParams.value = {
    ...defaultSearchParams,
  };
};
</script>

<style scoped>
#problemSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}

.search-bar {
  margin-bottom: var(--d-space-4);
  padding-bottom: var(--d-space-4);
  border-bottom: 1px solid var(--d-line);
}

.judge-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.judge-info__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.judge-info__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.judge-info__message {
  font-size: 12px;
  color: var(--d-ink-secondary);
}

.judge-info__metrics {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--d-ink-muted);
  padding-left: 16px;
}

.id-cell {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--d-ink-muted);
  user-select: all;
}

.problem-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.submitted-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.problem-cell__title {
  font-size: 14px;
}
</style>
