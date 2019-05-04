<template>
    <div class="box">
      <quill-editor
        v-model="formItem.content"
        ref="myQuillEditor"
        :options="editorOption"
      >
      </quill-editor>
      <div style="margin-top: 10px">
        <Upload
          :action="upUrl"
          :on-success="handleSuccess">
          <Button icon="ios-cloud-upload-outline">上传附件</Button>
        </Upload>
      </div>
      <div style="display: flex; justify-content: center">
        <Button type="primary" style="margin-right: 20px;color: #fff" @click="addReport">提交</Button>
        <Poptip
          confirm
          title="清空实验报告并返回上一级?"
          @on-ok="ok"
        >
          <Button>返回上一级</Button>
        </Poptip>
      </div>
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
        upUrl: this.BaseConfig + '/fileUpload',     // 上传文件传入地址
        formItem: {
          teskId: null,
          courseId: null,
          studentUserId: JSON.parse(localStorage.getItem('loginInfo')).userId,
          studentFileUrl: '',
          content: '',
          updateTime: new Date().getTime(),
        },
      }
    },

    created() {
      this.formItem.teskId = this.$route.query.taskId;
      this.getTaskInfo();
    },

    methods: {
      //上传文件成功回调传回地址
      handleSuccess (res, file) {
        this.formItem.studentFileUrl = res.data;
      },

        getTaskInfo() {
            let that = this;
            let url = that.BaseConfig + '/selectExpTeskById';
            let params = {
                expTeskId:this.formItem.teskId
            };
            let data = null;
            that
                .$http(url, params, data, 'get')
                .then(res => {
                    data = res.data;
                    if(data.retCode === 0) {
                        this.formItem.taskId = data.data.id;
                        this.formItem.courseId = data.data.courseId;
                        this.formItem.content = data.data.content;
                    } else {
                        that.$Message.error(data.retMsg);
                    }
                })
                .catch(err => {
                    that.$Message.error('请求错误');
                })
        },

      //提交实验报告
      addReport() {
        let that = this;
        let url = that.BaseConfig + '/insertExpReport';
        let data = that.formItem;
        if(that.formItem.courseId === null) {
          that.$Message.warning('未进入该课程！');
        } else {
          that
            .$http(url,'', data, 'post')
            .then(res => {
              if(res.data.retCode === 0) {
                that.$Message.success('提交实验报告成功');
                that.$router.push({
                  path: '/teachManage/experimentReportS',
                })
              }
            })
            .catch(err => {
              that.$Message.error('请求错误');
            })
        }

      },

      //清空实验报告并返回上一级
      ok() {
       this.$router.push({
         path: '/teachManage/experimentReportS',
         query: {
           courseId: this.formItem.courseId
         }
       })
      },

    }
  }
</script>

<style scoped>
  /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 480px;
    overflow-y: scroll;
  }
  .ivu-btn {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }
</style>
