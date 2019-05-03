<template>
  <div  class="box report-info">
    <p>实验题目：{{formItem.title}}</p>
    <div style="display: flex"> <p>实验内容：</p><p v-html="formItem.content"></p></div>
    <p>课程名称：{{formItem.courseName}}</p>
    <p>提交时间：{{formItem.updateTime}}</p>
    <p>学生：{{formItem.name}}</p>
    <p>得分：{{formItem.score}}</p>
    <p v-if="!formItem.studentFileUrl">福建报告：无</p>
    <p v-if="formItem.studentFileUrl">福建报告：<a :href="formItem.studentFileUrl" style="padding-left: 10px">
      {{studentFileUrl}}</a>
    </p>
    <div style="margin-top: 10px">
      <Button type="primary" style="color: #fff" @click="isComment = true;" v-if="level === 1">评分</Button>
      <Button @click="goBack">返回上一级</Button>
    </div>
    <!--评分模态框-->
    <Modal
            v-model="isComment"
            title="报告评分"
            @on-ok="submitScore"
    >
      <Input v-model="formItem.score" @on-change="numConfirm" placeholder="输入分数" style="width: 200px"></Input>
    </Modal>
  </div>
  <!--<div class="box">-->
    <!--<Form :model="formItem" :label-width="80">-->
      <!--<FormItem label="实验题目：">-->
        <!--<Input v-model="formItem.title" readonly></Input>-->
      <!--</FormItem>-->
      <!--<FormItem label="实验内容：">-->
        <!--<quill-editor-->
                <!--v-model="formItem.content"-->
                <!--ref="myQuillEditor"-->
                <!--:options="editorOption"-->
        <!--&gt;-->
        <!--</quill-editor>-->
      <!--</FormItem>-->
      <!--<FormItem label="课程名称：">-->
        <!--<Input v-model="formItem.courseName" style="width: 187px" readonly></Input>-->
      <!--</FormItem>-->
      <!--<FormItem label="提交时间：">-->
        <!--<Input v-model="formItem.updateTime" style="width: 187px" readonly></Input>-->
      <!--</FormItem>-->
      <!--<FormItem label="学生：">-->
        <!--<Input v-model="formItem.name" style="width: 187px" readonly></Input>-->
      <!--</FormItem>-->
      <!--<FormItem label="得分：">-->
        <!--<Input v-model="formItem.score" style="width: 187px" readonly></Input>&nbsp;&nbsp;&nbsp;-->
        <!--<a href="" v-if="level === 1">去评分</a>-->
      <!--</FormItem>-->
      <!--<FormItem label="报告附件：">-->
        <!--{{formItem.studentFileUrl}}-->
        <!--<a :href="formItem.studentFileUrl" style="padding-left: 10px">点击下载报告附件</a>-->
      <!--</FormItem>-->
    <!--</Form>-->
    <!--<div><Button @click="goBack">返回上一级</Button></div>-->
  <!--</div>-->
</template>

<script>
    import { quillEditor } from 'vue-quill-editor';
  export default {
      components: {
          quillEditor,
      },
    data() {
      return {
        studentFileUrl: '',
        editorOption:{},
        expReportId: null,
        level: null,
        isComment: false,
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
      this.level = parseInt(this.Cookies.get('access'));
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
              if(that.formItem.studentFileUrl !== null) {
                  let a = this.formItem.studentFileUrl;
                  let index = a.lastIndexOf('\/');
                  this.studentFileUrl = a.substring(index+1, a.length);
              }
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

        //数字正则
        numConfirm() {
            // let re=/^(?:[1-9]?\d|100)$/;
            let re = /^([1-9]\d|\d)$/;
            if(re.test(this.formItem.score)){
            }else{
                this.$Message.warning('请输入0~99的两位数！')
            }
        },

        submitScore() {
            let re = /^([1-9]\d|\d)$/;
            if(re.test(this.formItem.score)){
                this.commentScore();
            }else{
                this.$Message.warning('请输入0~99的两位数！')
            }
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

    }
  }
</script>

<style lang="less" scoped>
  .report-info {
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
