<template>
  <div  class="box task-info">
    <p>实验题目：{{formItem.title}}</p>
    <div style="display: flex"> <p>实验内容：</p><p v-html="formItem.content"></p></div>
    <p>课程名称：{{formItem.courseName}}</p>
    <p>开始时间：{{startTime}}</p>
    <p>结束时间：{{endTime}}</p>
    <p v-if="!formItem.fileUrl">课件：无</p>
    <p v-if="formItem.fileUrl">课件：<a :href="formItem.fileUrl" style="padding-left: 10px">
      {{fileUrl}}</a>
    </p>
   <div><Button @click="goBack">返回上一级</Button></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fileUrl: '',
        expTeskId : null,
        editorOption:{},
        startTime: '',
        endTime: '',
        formItem: {
          title:'',
          content: null,
          courseId: null,
          romId: null,
          startTime: '',
          endTime: '',
          fileUrl: '',
        },
      }
    },

    created() {
      this.expTeskId  = this.$route.query.expTeskId ;
      this.getTaskInfo();

    },

    methods: {
      //通过ID获取实验任务信息
      getTaskInfo() {
        let that = this;
        let url = that.BaseConfig + '/selectExpTeskById';
        let params = {
          expTeskId : that.expTeskId ,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.formItem = data.data;
              that.startTime = that.formItem.startTime;
              that.endTime = that.formItem.endTime;
                let a = this.formItem.fileUrl;
                let index = a.lastIndexOf('\/');
                this.fileUrl = a.substring(index+1, a.length);
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //富文本事件
      onEditorFocus($event) {
        this.$Message.warning('当前页仅查看');
      },

      //返回上一级
      goBack() {
        this.$router.push({
          path: '/teachManage/experimentTask',
          query: {
            courseId: this.formItem.courseId,
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .task-info {
    color: #000;
    font-size: 15px;
    letter-spacing: 1px;
    p {
      line-height: 35px;
    }
  }
  /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 200px;
    overflow-y: scroll;
  }
  .ivu-btn {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }
</style>
