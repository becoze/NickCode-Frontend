<template>
  <div id="addProblemView">
    <h2>Add Problems</h2>

    <a-form :model="form" label-align="left" style="margin-left: 300px">
      <a-form-item field="title" label="Title">
        <a-input
          v-model="form.title"
          placeholder="New Title"
          style="max-width: 640px"
        />
      </a-form-item>
      <a-form-item field="tags" label="Tag">
        <a-input-tag
          v-model="form.tags"
          placeholder="New Tags"
          allow-clear
          style="max-width: 640px"
        />
      </a-form-item>
      <a-form-item field="content" label="Content">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="Answer">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item
        label="Judge Config"
        :content-flex="false"
        :merge-props="false"
      >
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="timeLimit">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="e.g. 1000"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="memoryLimit">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="e.g. 1000"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="stackLimit">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="e.g. 1000"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="Judge Sample"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 640px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`Sample Input -${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="Please enter test input"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`Sample Output -${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="Please enter test output"
              />
            </a-form-item>
            <a-button
              status="danger"
              type="outline"
              @click="handleDelete(index)"
            >
              - Delete Case
            </a-button>
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >+ Add Test Case
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 64px" />
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import message from "@arco-design/web-vue/es/message";
import { ProblemControllerService } from "../../../generated";
import { useRoute } from "vue-router";

const route = useRoute();
// If the page address contains “update”, it shall be regarded as an "update page" page.
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * Retrieve data via `getProblemByIdUsingGet`,
 * then convert the data from JSON to JavaScript if they are not JSON,
 * and finally display it using a `form`.
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await ProblemControllerService.getProblemByIdUsingGet(id as any);
  // load "input" and "output" data, convert Json format request response into js
  if (res.code === 0) {
    form.value = res.data as any;
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    // load "memoryLimit", "stackLimit" and "timeLimit" data, convert Json format request response into js
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        timeLimit: 1000,
        stackLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    // load "tags", convert Json format request response into js
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("error" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  console.log(form.value);
  if (updatePage) {
    // submit function for UPDATE
    const res = await ProblemControllerService.updateProblemUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("Successfully Update Problem");
    } else {
      message.error("Update Fail," + res.message);
    }
  } else {
    // submit function for ADD
    const res = await ProblemControllerService.addProblemUsingPost(form.value);
    if (res.code === 0) {
      message.success("Successfully Add Problem");
    } else {
      message.error("Add Fail," + res.message);
    }
  }
};

/**
 * Add new judge case
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * Delete judge case
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#addProblemView {
}
</style>
