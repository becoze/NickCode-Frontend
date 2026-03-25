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
    <template #createTime="{ record }">
      {{ moment(record.createTime).format("hh:mm a, DD-MMM-YYYY") }}
    </template>
    <template #tags="{ record }">
      <a-space wrap>
        <a-tag
          v-for="(tag, index) in formatTags(record.tags)"
          :key="index"
          color="green"
          >{{ tag }}
        </a-tag>
      </a-space>
    </template>
    <template #userName="{ record }">
      {{ userNameMap[record.userId] ?? "Loading..." }}
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from "vue";
import {
  Problem,
  ProblemControllerService,
  ProblemQueryRequest,
  UserControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10, // matched with backend "long pageSize"
  current: 1, // matched with backend "long current"
});

// Turn JSON to String for "tags" variable
const formatTags = (tags: any): string[] => {
  if (!tags) return [];

  // case 1: already array
  if (Array.isArray(tags)) return tags;

  // case 2: string → parse JSON
  try {
    return JSON.parse(tags);
  } catch (e) {
    // fallback: "a,b,c" → ["a","b","c"]
    return tags.split(",");
  }
};

const userNameMap = reactive<Record<string, string>>({});
const loadUserNames = async (records: any[]) => {
  const userIds = [
    ...new Set(records.map((item) => item.userId).filter(Boolean)),
  ];

  for (const userId of userIds) {
    // skip if already loaded
    if (userNameMap[userId]) continue;

    try {
      const res = await UserControllerService.getUserByIdUsingGet(userId);
      if (res.code === 0 && res.data) {
        userNameMap[userId] = res.data.userName;
      } else {
        userNameMap[userId] = "Unknown";
      }
    } catch (error) {
      userNameMap[userId] = "Unknown";
    }
  }
};

const loadData = async () => {
  const res = await ProblemControllerService.listProblemByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    await loadUserNames(res.data.records || []);
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
  // {
  //   title: "Content",
  //   dataIndex: "content",
  // },
  {
    title: "Tags",
    slotName: "tags",
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
    title: "User name",
    dataIndex: "userId",
    slotName: "userName",
  },
  {
    title: "Create Time",
    dataIndex: "createTime",
    slotName: "createTime",
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
