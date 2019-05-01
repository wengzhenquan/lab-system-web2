<template>
  <div>
    <Form :model="formItem" :label-width="80">
      <FormItem label="实验题目：">
        <Input v-model="formItem.title" readonly></Input>
      </FormItem>
      <FormItem label="实验内容：">
        <div v-html="formItem.content" style="border: 1px solid #ccc;"></div>
      </FormItem>
      <FormItem label="课程名称：">
        <Input v-model="formItem.courseName" style="width: 187px" readonly></Input>
      </FormItem>
      <FormItem label="开始时间：">
        <Row>
          <Col span="11">
            <DatePicker type="date" placeholder="Select date" v-model="startTime" readonly></DatePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="结束时间：">
        <Row>
          <Col span="11">
            <DatePicker type="date" placeholder="Select date" v-model="endTime" readonly></DatePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="课件：">
        {{formItem.fileUrl}}
        <a :href="formItem.fileUrl" style="padding-left: 10px">点击下载课件</a>
      </FormItem>
    </Form>
   <div><Button @click="goBack">返回上一级</Button></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
          path: './experimentTask',
          query: {
            courseId: this.formItem.courseId,
          }
        })
      },
    }
  }
</script>

<style scoped>
  /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 200px;
    overflow-y: scroll;
  }
  .ivu-btn {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }
</style>
