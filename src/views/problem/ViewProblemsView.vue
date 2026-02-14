<template>
  <div id="viewProblemsView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="problem">
          <a-tab-pane key="problem" title="Problem">
            <a-card v-if="problem" :title="problem.title">
              <MdViewer :value="problem.content || ''" />
              <a-descriptions title="Pass Limit" :column="{ xs: 1 }">
                <a-descriptions-item label="Time Limit">
                  {{ problem.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="Memory Limit">
                  {{ problem.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of problem.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" title="Answer"> Answer</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="code">
          <template #extra>
            <a-form :model="form" layout="inline" style="margin-bottom: -6px">
              <a-form-item field="language" style="min-width: 100px">
                <a-select v-model="form.language" :style="{ width: '100px' }">
                  <a-option>java</a-option>
                  <a-option>cpp</a-option>
                  <a-option>go</a-option>
                  <a-option>html</a-option>
                </a-select>
              </a-form-item>
            </a-form>
            <a-button type="primary" style="min-width: 150px" @click="doSubmit"
              >Submit
            </a-button>
          </template>
          <a-tab-pane key="code" title="Code">
            <CodeEditor
              :value="form.code"
              :language="form.language"
              :handle-change="changeCode"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import {
  ProblemControllerService,
  ProblemSubmitAddRequest,
  ProblemSubmitControllerService,
  ProblemVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const problem = ref<ProblemVO>();

const loadData = async () => {
  const res = await ProblemControllerService.getProblemVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    problem.value = res.data;
  } else {
    message.error("Data Load Error" + res.message);
  }
};

const form = ref<ProblemSubmitAddRequest>({
  language: "java",
  code: "",
});

const doSubmit = async () => {
  if (!problem.value?.id) {
    return;
  }

  const res = await ProblemSubmitControllerService.doProblemSubmitUsingPost({
    ...form.value,
    problemId: problem.value.id,
  });
  if (res.code === 0) {
    message.success("Submit Success");
  } else {
    message.error("Submit Fail" + res.message);
  }
};

/**
 * Load event
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style>
#viewProblemsView {
}

#viewProblemsView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
