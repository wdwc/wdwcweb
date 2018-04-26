<template>
  <v-app>
    <v-toolbar app>Toolbar</v-toolbar>
    <v-navigation-drawer
      app
      permanent
      clipped>
      <drag
        v-for="(item) in items"
        :key="item.tag"
        :transfer-data="item">
        <template slot-scope="props">
          <v-chip>
            <div v-if="props.transferData">
              Dragging {{ props.transferData }}
            </div>
            <div v-else>&#x3C; {{ item.tag }} ></div>
          </v-chip>
        </template>
      </drag>
    </v-navigation-drawer>
    <v-content>
      <v-container >
        <router-view>
          test
        </router-view>
        <v-tabs v-model="active">
          <v-tab>Tree</v-tab>
          <v-tab>HTML</v-tab>
          <v-tab>TinyMCE</v-tab>
          <v-tab-item>
            <htmltag
              :subtags="htmltree"
              tag="div" />
          </v-tab-item>
          <v-tab-item>
            <span v-html="theHTML"/>
            <span v-html="code"/>
            <span
              v-if="!validHTML"
              style="background-color: red;">ERROR IN HTML</span>
            <!-- or to manually control the datasynchronization（或者手动控制数据流，需要像这样手动监听changed事件） -->
            <codemirror
              ref="myCm"
              :value="theHTML"
              :options="cmOptions"
              @ready="onCmReady"
              @focus="onCmFocus"
              @input="onCmCodeChange"
            />
          </v-tab-item>
          <v-tab-item>
            <tinymce
              id="d1"
              :other_options="tinyOptions"
              v-model="editorContent"
            />
          </v-tab-item>
        </v-tabs>
      </v-container>
      <v-container >
        <span
          v-sauce
          style="background-color: yellow">reinier</span>
      </v-container>
    </v-content>
    <v-footer app/>
  </v-app>
</template>

<script>
import htmltag from './components/htmltag';
// require component
import { codemirror } from 'vue-codemirror';

// require styles
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';

import 'codemirror/addon/mode/multiplex';
//import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import tinymce from 'vue-tinymce-editor';

export default {
  components: { htmltag, codemirror, tinymce },
  props: {
    defaultHtml: {
      type: String,
      default() {
        const result = this.theHTML;

        return result;
      }
    },
    items: {
      type: Array,
      default() {
        const text = 'br|hr|input|source|frame|param|area|meta|col|link|option|base|img|wbr||a|abbr|acronym|address|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video'.split(
          '|'
        );
        const tags = [];
        for (let i = 0; i < text.length; i++) {
          tags.push({
            tag: text[i],
            subtags: []
          });
        }
        return tags;
      }
    },
    htmltree: {
      type: Array,
      default() {
        return [
          {
            tag: 'div',
            subtags: [
              {
                tag: 'span',
                subtags: []
              },
              { tag: 'ul', subtags: [] }
            ]
          }
        ];
      }
    }
  },
  data() {
    return {
      editorContent:
        '<h2 style="color: #339966;">Hi there from TinyMCE for Vue.js.</h2> <p>&nbsp;</p> <p><span>Hey y`all.</span></p>',
      tinyOptions: {
        height: 500
      },
      editorcode: '<DIV></DIV>',
      code: '<DIV></DIV>', //this.defaultHtml, //'<h1>reinier</h1>', //this.theHTML,
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/html',
        theme: 'cobalt', // make sure to pick a theme that knows html
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    };
  },
  computed: {
    theHTML() {
      const html = getTag(this.htmltree[0]);
      function getTag(tag) {
        let miniresult = '<' + tag.tag + '>' + '\n';

        for (let i = 0; i < tag.subtags.length; i++) {
          miniresult += getTag(tag.subtags[i]);
        }

        miniresult += '</' + tag.tag + '>';
        return miniresult;
      }
      console.log(html);
      return html;
    },
    validHTML() {
      console.log('validating ' + this.editorcode);
      const result = isHTML(this.editorcode);
      console.log('is ', result);
      return result;
      function isHTML(str) {
        // Yes, I copied this from the interwebs
        //  https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not
        return /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(
          str
        );
        // this method inserts the html into the browsers and see if the browser accepts it. In my tests, it always does
        /*    const a = document.createElement('div');
        a.innerHTML = str;

        for (let c = a.childNodes, i = c.length; i--; ) {
          if (c[i].nodeType == 1) return true;
        }

        return false;*/
        // this is the shorthand version of that

        /*      const doc = new DOMParser().parseFromString(str, 'text/html');
        return Array.from(doc.body.childNodes).some(
          node => node.nodeType === 1
        );*/
      }
    }
  },
  methods: {
    onCmCodeChange(newCode) {
      this.editorcode = newCode;
      if (!this.invalidHTML) {
        this.code = newCode;
      }
    },
    onCmReady() {},
    onCmFocus() {}
  }
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
