<template>
  <div id="problemsView">
    <section class="d-panel d-reg">
      <header class="d-panel__head">
        <div class="d-panel__title">
          <span class="d-label">Problem Set</span>
          <span class="d-code">DB // PROBLEMS</span>
        </div>
        <span class="d-code">TOTAL: {{ total }}</span>
      </header>

      <div class="d-panel__body">
        <a-form :model="searchParams" layout="inline" class="search-bar">
          <a-form-item
            field="title"
            label="Search problems"
            style="min-width: 360px"
          >
            <a-input v-model="searchParams.title" placeholder="e.g. Two Sum" />
          </a-form-item>
          <a-form-item
            field="tags"
            label="Search Tags"
            style="min-width: 300px"
          >
            <a-input-tag
              v-model="searchParams.tags"
              placeholder="e.g. tree, press [enter]"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="doSubmit"
              >Search problems</a-button
            >
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
          <template #title="{ record }">
            <div class="problem-title-cell">
              <span class="problem-title-cell__title">{{ record.title }}</span>
              <span class="problem-title-cell__id">{{ record.id }}</span>
            </div>
          </template>
          <template #tags="{ record }">
            <a-space wrap>
              <a-tag
                v-for="(tag, index) of record.tags"
                :key="index"
                color="green"
                >{{ tag }}
              </a-tag>
            </a-space>
          </template>
          <template #acceptedRate="{ record }">
            <span class="d-mono-cell">
              {{
                `${
                  record.submitNum ? record.acceptedNum / record.submitNum : "0"
                }% (${record.acceptedNum} / ${record.submitNum})`
              }}
            </span>
          </template>
          <template #createTime="{ record }">
            <span class="d-mono-cell">{{
              moment(record.createTime).format("DD-MMM-YYYY")
            }}</span>
          </template>
          <template #optional="{ record }">
            <a-space>
              <a-button
                type="primary"
                size="small"
                @click="toProblemPage(record)"
                >Solve</a-button
              >
            </a-space>
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
  ProblemQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<ProblemQueryRequest>({
  title: "",
  tags: [],
  pageSize: 15, // matched with backend "long pageSize"
  current: 1, // matched with backend "long current"
});
const defaultSearchParams = {
  title: "",
  tags: [],
  pageSize: 15,
  current: 1,
};

const loadData = async () => {
  const res = await ProblemControllerService.listProblemVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("Data Load Error" + res.message);
  }
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
    title: "Title",
    dataIndex: "title",
    slotName: "title",
  },
  {
    title: "Tags",
    slotName: "tags",
  },
  {
    title: "Accepted",
    slotName: "acceptedRate",
  },
  {
    title: "Created",
    slotName: "createTime",
  },
  {
    title: "",
    slotName: "optional",
    width: 110,
  },
];

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
#problemsView {
  max-width: 1280px;
  margin: 0 auto;
}

.search-bar {
  margin-bottom: var(--d-space-4);
  padding-bottom: var(--d-space-4);
  border-bottom: 1px solid var(--d-line);
}

.problem-title-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.problem-title-cell__title {
  font-size: 14px;
}

.problem-title-cell__id {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--d-ink-muted);
  user-select: all;
}
</style>
