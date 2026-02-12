<template>
  <div id="manageProblemView"></div>
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
    <template #optional="{ record }">
      <a-space>
        <a-button type="primary" @click="doUpdate(record)">Edit</a-button>
        <a-button status="danger" @click="doDelete(record)">Delete</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Problem, ProblemControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10, // matched with backend "long pageSize"
  current: 1, // matched with backend "long current"
});

const loadData = async () => {
  const res = await ProblemControllerService.listProblemByPageUsingPost(
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
    title: "id",
    dataIndex: "id",
  },
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Content",
    dataIndex: "content",
  },
  {
    title: "Tag",
    dataIndex: "tags",
  },
  {
    title: "Answer",
    dataIndex: "answer",
  },
  {
    title: "Number Submitted",
    dataIndex: "submitNum",
  },
  {
    title: "Number Passed",
    dataIndex: "acceptedNum",
  },
  {
    title: "Judge Config",
    dataIndex: "judgeConfig",
  },
  {
    title: "Judge Case",
    dataIndex: "judgeCase",
  },
  {
    title: "User Id",
    dataIndex: "userId",
  },
  {
    title: "Create Time",
    dataIndex: "createTime",
  },
  {
    title: "",
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (problem: Problem) => {
  const res = await ProblemControllerService.deleteProblemUsingPost({
    id: problem.id,
  });
  if (res.code === 0) {
    message.success("Delete Successful");
    loadData();
  } else {
    message.error("Delete Fail");
  }
};

const router = useRouter();

const doUpdate = (problem: Problem) => {
  router.push({
    path: "/update/problem",
    query: {
      id: problem.id,
    },
  });
};
</script>

<style scoped>
#manageProblemView {
}
</style>
