<template>
  <div id="problemSubmitView">
    <a-divider size="0" />
    <a-form :model="searchParams" layout="inline">
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
        <a-select v-model="searchParams.language" :style="{ width: '100px' }">
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
    <a-divider size="0" />
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
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("hh:mm a, DD-MMM-YYYY") }}
      </template>
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Problem,
  ProblemControllerService,
  ProblemSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<ProblemSubmitQueryRequest>({
  problemId: undefined,
  language: undefined,
  pageSize: 15, // matched with backend "long pageSize"
  current: 1, // matched with backend "long current"
});
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
    title: "ID", // Problem Number
    dataIndex: "id",
  },
  {
    title: "Language",
    dataIndex: "language",
  },
  {
    title: "Judge info",
    dataIndex: "judgeInfo",
    slotName: "judgeInfo",
  },
  {
    title: "Problem id",
    dataIndex: "problemId",
  },
  {
    title: "Status",
    dataIndex: "status",
    // TODO refresh status every 10 seconds
  },
  {
    title: "Create Time",
    dataIndex: "createTime",
    slotName: "createTime",
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
#problemSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
