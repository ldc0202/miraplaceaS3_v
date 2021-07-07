<template>
  <div id="shopping">
    <ShopChoice formatType="购物" />
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
#shopping {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

