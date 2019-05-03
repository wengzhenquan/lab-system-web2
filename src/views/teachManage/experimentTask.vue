<template>
  <div class="box">
    <div class="search-title">
      <div>
        <div>
          <p>课程名称：</p>
          <Select v-model="formItem.courseId" style="width:170px;margin-top: 8px">
            <Option v-for="item in courList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div>
          <p>教室名称：</p>
          <Input v-model="romName" style="width:170px;margin-top: 8px"></Input>
        </div>
      </div>
      <Button type="primary" @click="searchExp" style="height: 33px;margin-top: 8px;">搜索</Button>
    </div>
    <div class="user-manage" v-if="level === 1">
      <Router-link to="/addTask">
        <Button type="primary" style="height: 33px;margin-top: 10px;">添加实验任务</Button>
      </Router-link>
    </div>
    <Table border ref="selection" :columns="columns4" :data="taskList"></Table>
    <div style="margin-top: 20px; display: flex;justify-content: flex-end">
      <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
    </div>

    <Modal v-model="modal5" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确认删除</span>
      </p>
      <div style="text-align:center">
        <p>实验报告共有：{{courseInfoCount}}</p>
        <p>确认删除该任务?</p>
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
        loginInfo: [],               //用户登录信息
        level: null,
        pageNo: 1, pageNo1: 1, pageNo2: 1, total: 0, current: 1,
        taskList: [],       //课程列表
        courceList: [],
        courList:[],        //此用户（教师）开设的课程列表
        romsList: [],
        roList: [],         // 空闲状态的教室列表
        startTime: '',
        endTime: '',
          romName: '',
        formItem: {
          title:'',
          content: '',
          courseId: null,
          romId: null,
          startTime: '',
          endTime: '',
          fileUrl: '',
        },
          modal5: false,
          courseInfoCount: 0,
          expTeskId: null,
          columns4: [
          {
            title: '实验题目',
            key: 'title',
              align: 'center',
          },
          {
            title: '内容',
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
                        path: '/taskInfo',
                        query: {
                          expTeskId: params.row.id
                        }
                      });
                    }
                  }
                }, '查看'),
              ]);
            }
          },
          {
            title: '教室名称',
            key: 'romName',
              align: 'center',
          },
          {
            title: '开始时间',
            key: 'startTime',
              align: 'center',
          },
          {
            title: '结束时间',
            key: 'endTime',
              align: 'center',
          },
          {
            title: '实验报告',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('p', {
                  style: {
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      if(parseInt(this.Cookies.get('access')) === 3) {
                        this.$router.push({
                          path: '/addReport',
                          query: {
                            taskId: params.row.id,
                            courseId: params.row.courseId,
                            content: params.row.content,
                          }
                        })
                      } else {
                        this.$Message.warning('学生才可进行提交操作')
                      }
                    }
                  }
                }, '去提交'),
              ]);
            }
          },
          {
            title: '课程名',
            key: 'courseName',
              align: 'center',
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
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: '/editTask',
                        query: {
                          expTeskId: params.row.id
                        }
                      });
                    }
                  }
                }, '编辑'),
                // h('Button', {
                //   props: {
                //     type: 'primary',
                //     size: 'small'
                //   },
                //   style: {
                //     marginRight: '5px',
                //     display: parseInt(this.Cookies.get('access')) === 3? 'block': 'none',
                //   },
                //   on: {
                //     click: () => {
                //       this.$router.push({
                //         path: './taskInfo',
                //         query: {
                //           expTeskId: params.row.id
                //         }
                //       });
                //     }
                //   }
                // }, '查看'),
                  h('Button', {
                      props: {
                          type: 'error',
                          size: 'small'
                      },
                      style: {
                          marginRight: '5px',
                      },
                      on: {
                          click: () => {
                              console.log(params.row)
                              this.getInfoCount(params.row.id);
                              this.modal5 = true;
                          }
                      }
                  }, '删除'),
              ]);
            }
          }
        ],
      }
    },

    created() {
      // 老师进入要先选择实验课程名称，学生进入可查看所在课程的所有实验任务
      this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      this.level = parseInt(this.Cookies.get('access'));
      this.formItem.courseId = this.$route.query.courseId;
      if((this.formItem.courseId === undefined || this.formItem.courseId === null)&& this.level === 1)  {
        this.$Message.warning('请先选择课程名称');
      } else {
        this.getTaskList();
      }
      this.getCourceList();
    },

    methods: {
      //改变页数
      pageChange(val) {
        this.pageNo = val;
        this.getTaskList();
      },

      searchExp() {
          this.pageNo = 1;
          this.getTaskList();
      },

      //获取课程列表
      getCourceList() {
        let that = this;
        let url = that.BaseConfig + '/selectCourseAll';
        let params;
        if(this.level === 1) {
          params = {
            pageNo: that.pageNo1,
            pageSize: 10,
            teacherUserId: that.loginInfo.userId,
          }
        } else {
          params = {
            pageNo: that.pageNo1,
            pageSize: 10,
          }
        }
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

      //获取实验任务列表
      getTaskList() {
        let that = this;
        let url = that.BaseConfig + '/selectExpTeskAll';
        let params;
        if(that.level === 1 || (this.formItem.courseId !== undefined && this.formItem.courseId !== null)) {
          params = {
            romName: that.romName,
            courseId: that.formItem.courseId,
            pageNo: that.pageNo,
            pageSize: 10,
          }
        } else {
          params = {
            romName: that.romName,
            pageNo: that.pageNo,
            pageSize: 10,
          }
        }
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.taskList = data.data.data;
              that.total = data.data.total;
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

        getInfoCount(id) {
            let that = this;
            this.expTeskId  = id ;
            let url = that.BaseConfig + '/getReportCount';
            let params = {
                expTeskId: id,
            };
            let data = null;
            that
                .$http(url, params, data, 'get')
                .then(res => {
                    data = res.data;
                    if(data.retCode === 0) {
                        this.courseInfoCount = data.data;
                    }
                })
                .catch(err => {
                    that.$Message.error('请求错误');
                })
        },
        del() {
            let that = this;
            let url = that.BaseConfig + '/deleteExpTesk';
            let params = {
                expTeskId : that.expTeskId,
            };
            let data = null;
            that
                .$http(url, params, data, 'get')
                .then(res => {
                    data = res.data;
                    if(data.retCode === 0) {
                        this.$Message.success('任务删除成功！');
                        that.modal5 = false;
                        that.getTaskList();
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
  .user-manage {
    display: flex;
    justify-content: space-between;
  }
</style>
