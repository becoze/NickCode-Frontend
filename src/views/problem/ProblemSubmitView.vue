<template>
  <div id="problemSubmitView">
    <a-divider size="0" />
    <a-form :model="searchParams" layout="inline">
      <a-form-item
        field="title"
        label="Search problems"
        style="min-width: 360px"
      >
        <a-input v-model="searchParams.title" placeholder="e.g. Two Sum" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">Search problems</a-button>
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum ? record.acceptedNum / record.submitNum : "0"
          }% (${record.acceptedNum} / ${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("DD-MMM-YYYY") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toProblemPage(record)">Go!</a-button>
        </a-space>
      </template>
    </a-table>
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
  const res = await ProblemControllerService.listProblemSubmitByPageUsingPost(
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
    // title: "", // Problem Number
    dataIndex: "id",
  },
  {
    // title: "",
    dataIndex: "language",
  },
  {
    // title: "",
    slotName: "judgeInfo",
  },
  {
    // title: "",
    slotName: "title",
  },
  {
    // title: "",
    slotName: "status",
  },
  {
    // title: "Create Time",
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
