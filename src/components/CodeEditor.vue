<template>
  <!-- Main container for the code editor component -->
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 400px; height: 70vh"
  />
</template>

<script setup lang="ts">
// Import Monaco Editor and Vue composition API
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

/**
 * Interface defining the component properties types
 * @property value - The initial value of the code editor
 * @property handleChange - Callback function to handle value changes
 * @property readonly - When true, the editor is view-only: text can still be
 *   selected and copied, but it cannot be edited.
 */
interface Props {
  value: string;
  language?: string;
  readonly?: boolean;
  handleChange: (v: string) => void;
}

/**
 * Default value for this component
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "java",
  readonly: () => false,
  handleChange: (v: string) => {
    console.log(v);
  },
});

// Reference to the DOM element where the editor will be mounted
const codeEditorRef = ref();
// Reference to the Monaco Editor instance
const codeEditor = ref();

watch(
  () => props.language,
  () => {
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
  }
);

/**
 * Lifecycle hook that runs after the component is mounted
 * Initializes the Monaco Editor with specified configuration
 */
onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  // Create and configure the Monaco Editor instance
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    minimap: {
      enabled: true,
      scale: 6,
    },
    colorDecorators: true,
    readOnly: props.readonly,
    domReadOnly: props.readonly,
    theme: "vs-dark",
  });

  // Event listener for editor content changes
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});

// In read-only mode the value may arrive/refresh after mount; keep the editor
// in sync. Guarded by `readonly` so it never fights the cursor while editing.
watch(
  () => props.value,
  (next) => {
    if (!props.readonly || !codeEditor.value) {
      return;
    }
    const editor = toRaw(codeEditor.value);
    if (editor.getValue() !== next) {
      editor.setValue(next ?? "");
    }
  }
);
</script>

<style scoped></style>
