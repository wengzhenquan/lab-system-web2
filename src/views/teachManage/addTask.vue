<template>
    <div style="background-color: #fff;border-radius: 5px;padding: 12px">
      <!--添加实验任务-->
      <!--老师才可添加实验任务、且课程必须是此老师所开设的课程-->
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
          <Input v-model="formItem.romId" disabled style="width: 100px;margin-right: 10px"></Input>
          <Button type="primary" @click="modal7 = true">选择教室</Button>
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
        <Button type="primary" style="margin-right: 20px" @click="addTask">添加</Button>
        <Poptip
          confirm
          title="取消添加该实验任务?"
          @on-ok="ok"
          >
          <Button>取消</Button>
        </Poptip>
      </div>

      <div>
        <Modal
                v-model="modal7"
                title="添加实验任务"
                :footer-hide="true"
        >
          <div style="padding: 12px">
            <Table border ref="selection" :columns="columnsS" :data="romsList"></Table>
          </div>
        </Modal>
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
              modal7: false,
              loginInfo: [],
              editorOption:{},
              pageNo: 1, pageNo1:1,
              upUrl: this.BaseConfig + '/fileUpload',     // 上传文件传入地址
              startTime: '',
              endTime: '',
              courceList: [],
                pageNo2: 1,
                romsList: [],
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
                columnsS: [
                    {
                        title: '教室ID',
                        key: 'id'
                    },
                    {
                        title: '教室编号',
                        key: 'numb'
                    },
                    {
                        title: '教室名',
                        key: 'romName'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 140,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.formItem.romId = params.row.id;
                                            this.modal7 = false;
                                        }
                                    }
                                }, '选择'),
                            ]);
                        }
                    }
                ],
            }
        },

      created() {
        this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
        this.getCourceList();
        this.getRomsList();
      },

        methods: {
          //上传文件成功回调传回地址
          handleSuccess (res, file) {
            this.formItem.fileUrl = res.data;
          },

          //获取此用户开设的课程列表
          getCourceList() {
            let that = this;
            let url = that.BaseConfig + '/selectCourseAll';
            let params = {
              pageNo: that.pageNo1,
              pageSize: 10,
              teacherUserId: that.loginInfo.userId,
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

            //获取-实验室列表
            getRomsList() {
                let that = this;
                let url = that.BaseConfig + '/selectRomsAll';
                let params = {
                    pageNo: that.pageNo2,
                    pageSize: 10,
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.romsList = that.romsList.concat(res.data.data.data);
                            if (that.romsList.length < res.data.data.data.total) {
                                that.pageNo2++;
                                that.getRomsList();
                            }
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

          //添加实验任务
          addTask() {
            let that = this;

            if(that.formItem.title === '' || that.formItem.title === undefined) {
              that.$Message.warning('标题不能为空！')
            } else if (that.formItem.courseId === null) {
              that.$Message.warning('所属课程不能为空！')
            } else {
              let url = that.BaseConfig + '/insertExpTesk';
              that.formItem.startTime = new Date(that.startTime).getTime();
              that.formItem.endTime = new Date(that.endTime).getTime();
              let data = that.formItem;
              that
                .$http(url,'', data, 'post')
                .then(res => {
                  if(res.data.retCode === 0) {
                    that.$Message.success('添加实验任务成功');
                    that.$router.push({
                      path: '/teachManage/experimentTask',
                      query: {
                        courseId: that.formItem.courseId,
                      }
                    })
                  }
                })
                .catch(err => {
                  that.$Message.error('请求错误');
                })
            }
          },

          //取消添加任务
          ok() {
            this.$router.push({
              name: 'experimentTask',
            })
          },
        },
    }
</script>

<style lang="less" scoped>
  /deep/ .ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 200px;
    overflow-y: scroll;
  }
  /deep/ .ivu-modal-body {
    height: 300px;
    overflow: hidden;
    overflow-y: scroll;
  }
</style>
