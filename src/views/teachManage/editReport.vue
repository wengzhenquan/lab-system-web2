<template>
    <div class="box">
      <quill-editor
        v-model="formItem.content"
        ref="myQuillEditor"
        :options="editorOption"
      >
      </quill-editor>
      <div style="margin:10px">
        附件：{{fileUrl}}
        <!--重新上传按钮仅学生可见-->
        <Upload
          :action="upUrl"
          :on-success="handleSuccess"
          v-if="level === 3">
          <Button icon="ios-cloud-upload-outline">重新上传附件</Button>
        </Upload>
      </div>
      <div style="display: flex; justify-content: center">
        <!--重新提交仅学生可见-->
        <Button type="primary" style="margin-right: 20px;color: #fff" v-if="level === 3" @click="editReport">重新提交</Button>
        <!--评分仅老师可见-->
        <Button type="primary" v-if="level === 1" style="margin-right: 20px;color: #fff" @click="isComment=true">评分</Button>
        <Poptip
          confirm
          title="返回上一级?"
          @on-ok="ok"
        >
          <Button>返回上一级</Button>
        </Poptip>
      </div>

      <!--评分模态框-->
      <Modal
        v-model="isComment"
        title="报告评分"
        @on-ok="commentScore"
       >
        <Input v-model="formItem.score" placeholder="输入分数" style="width: 200px"></Input>
      </Modal>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        expReportId: null,
        editorOption:{},
        fileUrl: '',
        isComment: false,       //评分模态框
        upUrl: this.BaseConfig + '/fileUpload',     // 上传文件传入地址
        level: null,
        formItem: {
          teskId: null,
          courseId: null,
          studentUserId: null,
          studentFileUrl: '',
          content: '',
          updateTime: '',
          score: null,
        },
        editTime: '',
      }
    },

    created() {
      this.level = parseInt(this.Cookies.get('access'));
      this.expReportId = this.$route.query.expReportId;
      this.getReportInfo();
    },

    methods: {
      //上传文件成功回调传回地址
      handleSuccess (res, file) {
        this.formItem.studentFileUrl = res.data;
      },

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
              that.editTime = this.formItem.updateTime;
                let a = this.formItem.studentFileUrl;
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

      //学生重新提交实验报告
      editReport() {
        let that = this;
        let url = that.BaseConfig + '/updateExpReport';
        that.formItem.updateTime = new Date().getTime();
        let data = that.formItem;
        that
          .$http(url,'', data, 'post')
          .then(res => {
            if(res.data.retCode === 0) {
              that.$Message.success('修改成功');
              that.$router.push({
                path: '/teachManage/experimentReportS',
              })
            } else {
              that.$Message.error(res.data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //教师评分
      commentScore() {
        let that = this;
        let url = that.BaseConfig + '/updateExpReport';
        that.formItem.updateTime = new Date(that.editTime).getTime();
        let data = that.formItem;
        that
          .$http(url, '', data, 'post')
          .then(res => {
            if(res.data.retCode === 0) {
              that.$Message.success('评分完成');
              that.$router.push({
                path: '/teachManage/experimentReport',
                query: {
                  courseId: that.formItem.courseId,
                }
              })
            } else {
              that.$Message.error(res.data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      ok() {
        if(this.level === 1) {
          this.$router.push({
            path: '/teachManage/experimentReport',
            query: {
              courseId: this.formItem.courseId,
            }
          })
        } else {
          this.$router.go(-1);
        }
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
