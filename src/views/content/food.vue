<template>
  <div id="food">
    <ShopChoice formatType="美食" />
  </div>
</template>

<script>
import ShopChoice from "@/components/shopPart/shopChoice";
export default {
  components: { ShopChoice }
};
</script>

<style scoped lang='less'>
@media screen and (min-width: 2161px){}
@media screen and (max-width: 2160px){}
#food {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
