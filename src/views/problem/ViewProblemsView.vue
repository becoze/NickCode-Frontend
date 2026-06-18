<template>
  <div id="viewProblemsView">
    <a-row :gutter="[16, 16]">
      <a-col :md="12" :xs="24">
        <section class="d-panel d-reg work-panel">
          <header class="d-panel__head">
            <div class="d-panel__title">
              <span class="d-label">Problem</span>
              <span class="d-code">#{{ problem?.id ?? "—" }}</span>
            </div>
            <a-space wrap :size="4">
              <a-tag
                v-for="(tag, index) of problem?.tags"
                :key="index"
                color="green"
                >{{ tag }}
              </a-tag>
            </a-space>
          </header>
          <div class="d-panel__body">
            <a-tabs default-active-key="problem">
              <a-tab-pane key="problem" title="Problem">
                <template v-if="problem">
                  <h2 class="problem-title">{{ problem.title }}</h2>
                  <div class="limit-row">
                    <span class="limit-item d-code">
                      TIME {{ problem.judgeConfig.timeLimit ?? 0 }}ms
                    </span>
                    <span class="limit-item d-code">
                      MEM {{ problem.judgeConfig.memoryLimit ?? 0 }}KB
                    </span>
                  </div>
                  <MdViewer :value="problem.content || ''" />
                </template>
              </a-tab-pane>
              <a-tab-pane key="answer" title="Answer"> Answer</a-tab-pane>
            </a-tabs>
          </div>
        </section>
      </a-col>
      <a-col :md="12" :xs="24">
        <section class="d-panel d-reg work-panel">
          <header class="d-panel__head">
            <div class="d-panel__title">
              <span class="d-label">Workspace</span>
              <span class="d-code">// CODE</span>
            </div>
            <a-space :size="8">
              <a-form :model="form" layout="inline" class="lang-form">
                <a-form-item field="language" style="min-width: 100px">
                  <a-select v-model="form.language" :style="{ width: '110px' }">
                    <a-option>java</a-option>
                    <a-option>(more coming)</a-option>
                  </a-select>
                </a-form-item>
              </a-form>
              <a-button
                type="primary"
                style="min-width: 130px"
                @click="doSubmit"
                >Submit
              </a-button>
            </a-space>
          </header>
          <div class="editor-wrap">
            <CodeEditor
              :value="form.code"
              :language="form.language"
              :handle-change="changeCode"
            />
          </div>
        </section>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import {
  ProblemControllerService,
  ProblemSubmitAddRequest,
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

  const res = await ProblemControllerService.doProblemSubmitUsingPost({
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

#viewProblemsView .lang-form .arco-form-item {
  margin-bottom: 0;
}

#viewProblemsView .editor-wrap {
  border-top: 1px solid var(--d-line);
}

#viewProblemsView .problem-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 var(--d-space-3);
  color: var(--d-ink);
}

#viewProblemsView .limit-row {
  display: flex;
  gap: var(--d-space-2);
  margin-bottom: var(--d-space-4);
}

#viewProblemsView .limit-item {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  border: 1px solid var(--d-line);
  border-radius: var(--d-radius);
  padding: 4px var(--d-space-2);
  background: var(--d-bg);
}
</style>
