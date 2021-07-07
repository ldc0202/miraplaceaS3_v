<template>
  <div class="el-image">
    <slot v-if="loading" name="placeholder">
      <div class="el-image__placeholder"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="el-image__error">{{ t("el.image.error") }}</div>
    </slot>
    <img
      v-else
      class="el-image__inner"
      v-bind="$attrs"
      v-on="$listeners"
      @click="clickHandler"
      :src="src"
      :style="imageStyle"
      :class="{
        'el-image__inner--center': alignCenter,
        'el-image__preview': preview,
      }"
    />
    <template v-if="preview">
      <Preview
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="previewSrcList"
      />
    </template>
  </div>
</template>

<script>
import Preview from "./preview";
import { Image } from "element-ui";
export default {
  name: "ImagePreview",
  extends: Image,
  components: { Preview }
};
</script>