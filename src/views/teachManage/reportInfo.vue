<template>
  <div class="box">
    <Form :model="formItem" :label-width="80">
      <FormItem label="实验题目：">
        <Input v-model="formItem.title" readonly></Input>
      </FormItem>
      <FormItem label="实验内容：">
        <quill-editor
                v-model="formItem.content"
                ref="myQuillEditor"
                :options="editorOption"
        >
        </quill-editor>
      </FormItem>
      <FormItem label="课程名称：">
        <Input v-model="formItem.courseName" style="width: 187px" readonly></Input>
      </FormItem>
      <FormItem label="提交时间：">
        <Input v-model="formItem.updateTime" style="width: 187px" readonly></Input>
      </FormItem>
      <FormItem label="学生：">
        <Input v-model="formItem.name" style="width: 187px" readonly></Input>
      </FormItem>
      <FormItem label="得分：">
        <Input v-model="formItem.score" style="width: 187px" readonly></Input>&nbsp;&nbsp;&nbsp;
        <a href="" v-if="level === 1">去评分</a>
      </FormItem>
      <FormItem label="报告附件：">
        {{formItem.studentFileUrl}}
        <a :href="formItem.studentFileUrl" style="padding-left: 10px">点击下载报告附件</a>
      </FormItem>
    </Form>
    <div><Button @click="goBack">返回上一级</Button></div>
  </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor';
  export default {
      components: {
          quillEditor,
      },
    data() {
      return {
        editorOption:{},
        expReportId: null,
        level: this.Cookies.get('access'),
        formItem: {
          teskId: null,
          courseId: null,
          studentFileUrl: '',
          content: '',
          updateTime: '',
        },
      }
    },

    created() {
      this.expReportId = this.$route.query.expReportId;
      this.getReportInfo();
    },

    methods: {
      //通过Id获取实验报告内容
      getReportInfo() {
        let that = this;
        let url = that.BaseConfig + '/selectExpReportById';
        let params = {
          expReportId: that.expReportId  ,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.formItem = data.data;
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //返回上一级
      goBack() {
        this.$router.push({
          path: '/teachManage/experimentReport',
          query: {
            courseId: this.formItem.courseId,
          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 200px;
    overflow-y: scroll;
  }
  .ivu-btn {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }
</style>
