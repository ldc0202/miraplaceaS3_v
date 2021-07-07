<template>
  <div class="basepage_nopage animated fadeIn">
    <div class="basepage_nopage_content"></div>
    <div class="nopageContent">
      <div class="text">{{ tipText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tipText: {
      type: String,
      // 可选字段，有默认值
      default: "敬请期待"
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped lang='less'>
.basepage_nopage {
  width: 938px;
  height: 736px;
  margin: 0 auto;
  border-radius: 20px;
  .basepage_nopage_content {
    width: 912px;
    height: 706px;
    background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
    box-shadow: 0px 60px 50px #f3c7c4;
    // background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
    // box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
    opacity: 0.5;
    border-radius: 30px;
    margin-left: 26px;
  }
  .nopageContent {
    width: 912px;
    height: 706px;
    background: #ffffff;
    border: 2px solid #e66579;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    margin-top: -736px;
    .text {
      width: 200px;
      font-size: 42px;
      font-weight: bold;
      line-height: 30px;
      color: #e66579;
      text-align: center;
    }
  }
}
</style>
