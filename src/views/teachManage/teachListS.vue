<template>
    <div class="box">
      <!--<div class="search-title">-->
        <!--<div>-->
          <!--<div><p>课程名：</p><Input v-model="courseName" style="width: 150px;margin-top: 8px"/></div>-->
          <!--<div><p>教师名字：</p><Input v-model="teacherName" style="width: 150px;margin-top: 8px"/></div>-->
        <!--</div>-->
        <!--<Button type="primary" @click="searchTeach"  style="height: 33px;margin-top: 8px;">搜索</Button>-->
      <!--</div>-->
      <!--<div class="user-manage">-->
        <!--&lt;!&ndash;<Button type="primary" style="height: 33px;" @click="isAdd = true" v-if="level === 1">添加课程</Button>&ndash;&gt;-->
        <!--<Button type="success" style="height: 33px;" @click="getMyInfo" v-if="level === 1">只看自己</Button>-->
      <!--</div>-->
      <Tabs type="card" @on-click="tabChange">
        <TabPane label="全部课程">
          <div class="col" style="margin-top: 12px">
            <Table border ref="selection" :columns="columnsS" :data="courceList" v-if="level === 3"></Table>
          </div>
          <div style="margin-top: 20px; display: flex;justify-content: flex-end">
            <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
          </div>
        </TabPane>
        <TabPane label="已选课程">
          <div class="col" style="margin-top: 12px">
            <Table border ref="selection" :columns="columns4" :data="courceList" v-if="level === 3"></Table>
          </div>
          <div style="margin-top: 20px; display: flex;justify-content: flex-end">
            <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
          </div>
        </TabPane>
      </Tabs>

      <!--添加课程-->
      <div v-if="level === 1">
        <Modal
          v-model="isAdd"
          title="添加课程"
          @on-ok="addCource">
          <div>
            <Form :model="formItem" :label-width="80">
              <FormItem label="课程名称：">
                <Input v-model="formItem.courseName"></Input>
              </FormItem>
              <FormItem label="课程学分：">
                <Input v-model="formItem.totalScore"></Input>
              </FormItem>
              <FormItem label="开始时间：">
                <Row>
                  <Col span="11">
                    <DatePicker type="date" placeholder="Select date" v-model="formItem.startDate"></DatePicker>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="结束时间：">
                <Row>
                  <Col span="11">
                    <DatePicker type="date" placeholder="Select date" v-model="formItem.endDate"></DatePicker>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>

      <!--修改课程-->
      <Modal
        v-model="isEdit"
        title="修改课程"
        @on-ok="editCource">
        <div>
          <Form :model="formItem" :label-width="80">
            <FormItem label="课程名称：">
              <Input v-model="formItem.courseName"></Input>
            </FormItem>
            <FormItem label="课程学分：">
              <Input v-model="formItem.totalScore"></Input>
            </FormItem>
            <FormItem label="开始时间：">
              <Row>
                <Col span="11">
                  <DatePicker type="date" placeholder="Select date" v-model="formItem.startDate"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="结束时间：">
              <Row>
                <Col span="11">
                  <DatePicker type="date" placeholder="Select date" v-model="formItem.endDate"></DatePicker>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      </Modal>

      <Modal v-model="modal5" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>确认删除</span>
        </p>
        <div style="text-align:center">
          <p>实验任务共有：{{courseInfoCount.expTeskCount}}</p>
          <p>实验报告共有：{{courseInfoCount.expReportCount}}</p>
          <p>学生人数：{{courseInfoCount.studentCount}}</p>
          <p>确认删除该课程?</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="del">删除</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
              current: 1,
              courceList: [],     //课程列表
              pageNo: 1,
              total: 0,
              courseName: '',
              teacherName: '',
              modal5: false,
              columns4: [
                {
                  title: '课程名',
                  key: 'courseName'
                },
                  {
                      title: '课任老师',
                      key: 'name',
                  },
                {
                  title: '学分',
                  key: 'totalScore'
                },
                {
                  title: '开始时间',
                  key: 'startDate'
                },
                {
                  title: '结束时间',
                  key: 'endDate'
                },
                {
                  title: '实验任务',
                  align: 'center',
                  render: (h, params) => {
                    return h('div', [
                      h('p', {
                        style: {
                          color: '#2d8cf0'
                        },
                        on: {
                          click: () => {
                            this.$router.push({
                              path: '/teachManage/experimentTaskS',
                              query: {
                                courseId: params.row.id,
                              }
                            })
                          }
                        }
                      }, '查看'),
                    ])
                  }
                },
                {
                  title: '操作',
                  key: 'action',
                  align: 'center',
                  render: (h, params) => {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'primary',
                          size: 'small',
                          disabled: params.row.teacherUserId !== JSON.parse(localStorage.getItem('loginInfo')).userId ? 'true': false
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                              console.log(params.row.teacherUserId)
                            this.isEdit = true;
                            this.formItem.id = params.row.id;
                            this.getEditItem();
                          }
                        }
                      }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                                disabled: params.row.teacherUserId !== JSON.parse(localStorage.getItem('loginInfo')).userId ? 'true': false
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    // console.log(params.row)
                                    this.modal5 =true;
                                    this.getCourInfoCount(params.row.id);
                                }
                            }
                        }, '删除'),
                    ]);
                  }
                }
              ],
              columnsS: [
                {
                  title: '课程名',
                  key: 'courseName'
                },
                  {
                      title: '课任老师',
                      key: 'name',
                  },
                {
                  title: '学分',
                  key: 'totalScore'
                },
                {
                  title: '开始时间',
                  key: 'startDate'
                },
                {
                  title: '结束时间',
                  key: 'endDate'
                },
              ],
              isAdd: false,
              isEdit: false,
              formItem: {
                id: null,
                courseName: '',
                totalScore: null,
                startDate: '',
                endDate: '',
                studentId: null,
              },
              level: null,      //0-管理员  1-教师  2-设备管理员  3-学生
              courseInfoCount: [],
              courseId: null,
            }
        },

      created() {
          this.level = parseInt(this.Cookies.get('access'));
            this.formItem.studentId = JSON.parse(localStorage.getItem('loginInfo')).userId;
          this.getCourceList();
      },

        methods: {
          //改变页数
          pageChange(val) {
            this.pageNo = val;
            this.getCourceList();
          },

          tabChange(index) {
              this.pageNo = 1;
              if(index === 0) {
                  this.getCourceList();
              } else {
                  this.getMyCourceList();
              }
          },

            searchTeach() {
              this.pageNo = 1;
              this.getCourceList();
            },

            getMyInfo() {
              this.pageNo = 1;
              this.getMyCourceList();
            },

          //获取课程列表
          getCourceList() {
            let that = this;
            let url = that.BaseConfig + '/selectCourseAll';
            let params = {
                courseName: that.courseName,
                teacherName: that.teacherName,
                pageNo: that.pageNo,
                pageSize: 10,
            };
            let data = null;
            that
              .$http(url, params, data, 'get')
              .then(res => {
                data = res.data;
                if(data.retCode === 0) {
                  that.courceList = data.data.data;
                  that.total = data.data.total;
                } else {
                  that.$Message.error(data.retMsg);
                }
              })
              .catch(err => {
                that.$Message.error('请求错误');
              })
          },

          getMyCourceList() {
              let that = this;
              let url = that.BaseConfig + '/selectCourseAll';
              let params = {
                  courseName: that.courseName,
                  teacherName: that.teacherName,
                  studentId: this.formItem.studentId,
                  pageNo: that.pageNo,
                  pageSize: 10,
              };
              let data = null;
              that
                  .$http(url, params, data, 'get')
                  .then(res => {
                      data = res.data;
                      if(data.retCode === 0) {
                          that.courceList = data.data.data;
                          that.total = data.data.total;
                      } else {
                          that.$Message.error(data.retMsg);
                      }
                  })
                  .catch(err => {
                      that.$Message.error('请求错误');
                  })
          },

          //添加课程
          addCource() {
            let that = this;
            let url = that.BaseConfig + '/insertCourse';
            that.formItem.startDate = new Date(that.formItem.startDate).getTime();
            that.formItem.endDate = new Date(that.formItem.endDate).getTime();
            let data = that.formItem;
            that
              .$http(url,'', data, 'post')
              .then(res => {
               console.log('创建课程', res);
                if(res.data.retCode === 0) {
                  that.$Message.success('添加课程成功');
                  that.getCourceList();
                } else {
                  that.$Message.error(res.data.retMsg);
                }
              })
              .catch(err => {
                that.$Message.error('请求错误');
              })
          },

          //获取单个课程
          getEditItem() {
            let that = this;
            let url = that.BaseConfig + '/selectCourseById';
            let params = {
              courseId: that.formItem.id,
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

          //修改课程信息
          editCource() {
            let that = this;
            let url = that.BaseConfig + '/updateCourse';
            that.formItem.startDate = new Date(that.formItem.startDate).getTime();
            that.formItem.endDate = new Date(that.formItem.endDate).getTime();
            let data = that.formItem;
            that
              .$http(url,'', data, 'post')
              .then(res => {
                console.log('创建课程', res);
                if(res.data.retCode === 0) {
                  that.$Message.success('修改成功');
                  that.getCourceList();
                } else {
                  that.$Message.error(res.data.retMsg);
                }
              })
              .catch(err => {
                that.$Message.error('请求错误');
              })
          },

            //删除前获取相关数据
            getCourInfoCount(courseId) {
                let that = this;
                this.courseId = courseId;
                let url = that.BaseConfig + '/getCourseInfoCount';
                let params = {
                    courseId : courseId,
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            this.courseInfoCount = data.data;
                            console.log(this.courseInfoCount)
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            del() {
                let that = this;
                let url = that.BaseConfig + '/deleteCourse';
                let params = {
                    courseId : that.courseId,
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                           this.$Message.success('课程删除成功！');
                           that.modal5 = false;
                           that.getCourceList();
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
</style>
