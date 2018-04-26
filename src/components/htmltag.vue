<template>
  <span>
    <v-chip>&#x3C;{{ tag }}></v-chip>

    <drop
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover(tag, ...arguments)">
      Dropzone
    </drop>
    <div v-if="mysubtags">
      <div
        v-for="(item) in mysubtags"
        :key="item.tag">
        <template >
          <html-tag
            :tag="item.tag"
            :subtags="item.subtags"
          />
        </template>
      </div>
    </div>
    <v-chip>&#x3C;/ {{ tag }}></v-chip>
  </span>
</template>

<script>
//import { VChip } from 'vuetify';

export default {
  name: 'HtmlTag',
  props: {
    tag: {
      type: String,
      default: ''
    },
    subtags: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    mysubtags() {
      return this.subtags;
    }
  },
  methods: {
    canDrop(droptag) {
      /* I was tired
       * var candropTree = {
        ul: ['li'],
        ol: ['li']
      };

      var result = true;
candropTree.forEach(function(item, key){
  var result = result && typeof candropTree[tag][droptag] != 'undefined';

})
      if (typeof candropTree[this.tag] !== 'undefined') {
        debugger;
        var result2 = typeof candropTree[tag][droptag] != 'undefined';
      }*/
      let result = true;

      if (droptag === 'li') {
        result = this.tag === 'ol' || this.tag === 'ul';
      }
      return result;
    },
    handleDrop(data, event) {
      console.log(event);
      console.log(`You dropped with data: ${JSON.stringify(data)}`);
      this.subtags.push(data);
    },
    handleDragover(data, drag, event) {
      console.log('handleDragover', data);
      const can = this.canDrop(drag.tag);
      if (!can) {
        event.dataTransfer.dropEffect = 'none';
      }
      //alert(drag.tag + 'Can be dropped on ' + this.tag + ' is ' + can);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.drop.allowed {
  background-color: #dfd;
}
</style>
