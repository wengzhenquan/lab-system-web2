<template>
    <div class="box">
      <Form :model="formItem" :label-width="80">
        <FormItem label="实验题目：">
          <Input v-model="formItem.title" style="width: 300px"></Input>
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
          <Select v-model="formItem.courseId" style="width:200px">
            <Option v-for="item in courList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="实验教室：">
          <Input v-model="formItem.romName" style="width: 187px;margin-right: 10px" readonly></Input>
          <a href="" v-if="formItem.romId === null">申请教室</a>
          <a href="" v-else>更换教室</a>
        </FormItem>
        <FormItem label="开始时间：">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="Select date" v-model="startTime"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="结束时间：">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="Select date" v-model="endTime"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="课件：">
          <Upload
            :action="upUrl"
            :on-success="handleSuccess">
            <Button icon="ios-cloud-upload-outline">上传课件</Button>
          </Upload>
        </FormItem>
      </Form>
      <div style="display: flex; justify-content: center">
        <Button type="primary" style="margin-right: 20px" @click="editTask">修改</Button>
        <Poptip
          confirm
          title="取消修改该实验任务?"
          @on-ok="ok"
        >
          <Button>取消</Button>
        </Poptip>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        expTeskId : null,
        editorOption:{},
        pageNo: 1,
        upUrl: this.BaseConfig + '/fileUpload',     // 上传文件传入地址
        fileUrl: '',        //某个实验任务的课件
        startTime: '',
        endTime: '',
        courceList: [],
        courList:[],        //此用户（教师）开设的课程列表
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
      this.getCourceList();
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
              console.log(that.formItem)
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //获取此用户开设的课程列表
      getCourceList() {
        let that = this;
        let url = that.BaseConfig + '/selectCourseAll';
        let params = {
          pageNo: that.pageNo,
          pageSize: 10,
          teacherUserId: that.$store.state.loginInfo.userId,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.courceList = that.courceList.concat(data.data.data);
              if(that.courceList < data.data.total) {
                that.pageNo1++;
                that.getCourceList();
              } else {
                that.courceList.map(item=> {
                  that.courList.push({
                    value: item.id,
                    label: item.courseName
                  })
                });
              }
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //修改实验任务
      editTask() {
        let that = this;
        let url = that.BaseConfig + '/updateExpTesk';
        that.formItem.startTime = new Date(that.startTime).getTime();
        that.formItem.endTime = new Date(that.endTime).getTime();
        let data = that.formItem;
        that
          .$http(url,'', data, 'post')
          .then(res => {
            if(res.data.retCode === 0) {
              that.$Message.success('修改成功');
              that.$router.push({
                path: '/teachManage/experimentTask',
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

      //取消修改
      ok() {
        this.$router.push({
          path: '/teachManage/experimentTask',
          query: {
            courseId: this.formItem.courseId,
          }
        })
      },

      //上传文件成功回调传回地址
      handleSuccess (res, file) {
        this.formItem.fileUrl = res.data;
      },

    }
  }
</script>

<style scoped>
  /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 180px;
    overflow-y: scroll;
  }
</style>
