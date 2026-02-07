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
import { reactive } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import message from "@arco-design/web-vue/es/message";
import { ProblemControllerService } from "../../../generated";

let form = reactive({
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

// const doSubmit = async () => {
//   console.log(form);
// };

const doSubmit = async () => {
  console.log(form);
  // if (updatePage) {
  const res = await ProblemControllerService.addProblemUsingPost(form);
  if (res.code === 0) {
    message.success("更新成功");
  } else {
    message.error("更新失败，" + res.message);
  }
  // } else {
  //   const res = await ProblemControllerService.addProblemUsingPost(form);
  //   if (res.code === 0) {
  //     message.success("创建成功");
  //   } else {
  //     message.error("创建失败，" + res.message);
  //   }
  // }
};

/**
 * Add new judge case
 */
const handleAdd = () => {
  form.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * Delete judge case
 */
const handleDelete = (index: number) => {
  form.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.content = value;
};

const onAnswerChange = (value: string) => {
  form.answer = value;
};
</script>

<style scoped>
#addProblemView {
}
</style>
