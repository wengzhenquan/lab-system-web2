<template>
  <div class="box">
    <div class="search-title" style="margin-bottom: 12px">
      <div>
        <div>
          <p>课程名称：</p>
          <Select v-model="formItem.courseId" style="width:170px;margin-top: 8px">
            <Option v-for="item in courList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div>
          <p>任务标题：</p>
          <Input v-model="taskTitle" style="width: 150px;margin-top: 8px"/>
        </div>
        <div>
          <p>学生姓名：</p>
          <Input v-model="name" style="width: 150px;margin-top: 8px"/>
        </div>
      </div>
      <Button type="primary" @click="searchReport"  style="height: 33px;margin-top: 8px;">搜索</Button>
    </div>

    <Table border ref="selection" :columns="columns4" :data="reportList" v-if="level === 1"></Table>
    <Table border ref="selection" :columns="columnsS" :data="reportList" v-if="level !== 1"></Table>
    <div style="margin-top: 20px; display: flex;justify-content: flex-end">
      <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
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
</template>

<script>
  export default {
    data() {
      return {
        current: 1, pageNo: 1,pageNo1: 1, total: 0,
        courceList: [],
        courList: [],    //课程列表
        reportList: [],  //实验报告列表
        level: null,
        loginInfo: [],
        taskTitle: '',
        name: '',
        isComment: false,
        formItem: {
          courseId: null,
          score: null,
          teskId: null,           //不能为空
          studentUserId: null,    //不能为空
          updateTime: '',         //学生更新实验报告的时间
        },
        columns4: [
          {
            title: '任务标题',
            key: 'title',
            align: 'center',
          },
          {
            title: '报告内容',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('p', {
                  style: {
                    color: '#2d8cf0',
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: '/reportInfo',
                        query: {
                          expReportId: params.row.id
                        }
                      });
                    }
                  }
                }, '查看'),
              ]);
            }
          },
          {
            title: '所属课程',
            key: 'courseName',
            align: 'center',
          },
          {
            title: '提交时间',
            key: 'updateTime',
            align: 'center',
          },
          {
            title: '学生',
            key: 'name',
            align: 'center',
          },
          {
            title: '实验分',
            key: 'score',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 180,
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
                      this.isComment = true;
                      this.formItem = params.row
                    }
                  }
                }, '评分'),
              ]);
            }
          }
        ],
        columnsS: [
              {
                  title: '任务标题',
                  key: 'title',
                  align: 'center',
              },
              {
                  title: '报告内容',
                  align: 'center',
                  render: (h, params) => {
                      return h('div', [
                          h('p', {
                              style: {
                                  color: '#2d8cf0',
                              },
                              on: {
                                  click: () => {
                                      this.$router.push({
                                          path: '/reportInfo',
                                          query: {
                                              expReportId: params.row.id
                                          }
                                      });
                                  }
                              }
                          }, '查看'),
                      ]);
                  }
              },
              {
                  title: '所属课程',
                  key: 'courseName',
                  align: 'center',
              },
              {
                  title: '提交时间',
                  key: 'updateTime',
                  align: 'center',
              },
              {
                  title: '学生',
                  key: 'name',
                  align: 'center',
              },
              {
                  title: '实验分',
                  key: 'score',
                  align: 'center',
              },
              {
                  title: '操作',
                  key: 'action',
                  align: 'center',
                  width: 180,
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
                                          path: '/editReport',
                                          query: {
                                              expReportId: params.row.id,
                                          }
                                      })
                                  }
                              }
                          }, '修改'),
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
                                      this.del(params.row.id)
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
      //如果学生，直接显示学生所提交的实验报告
      this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      this.formItem.studentUserId = this.loginInfo.userId;
      this.formItem.courseId = this.$route.query.courseId;
      this.level = parseInt(this.Cookies.get('access'));
        this.getCourceList();
      if(this.level === 3) {
        this.getReportList();
      } else if(this.formItem.courseId !== undefined && this.formItem.courseId !== null) {
        this.getReportList();
      } else {
        this.$Message.warning('请选择课程名称');
      }
    },

    methods: {
      //改变页数
      pageChange(val) {
        this.pageNo = val;
        this.getReportList();
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

      //获取此用户开设的课程列表
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
                  studentId:that.loginInfo.userId,
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
                })
              }
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      searchReport(){
        this.pageNo = 1;
        this.getReportList();
      },

      //获取某课程下的实验报告列表
      getReportList() {
        let that = this;
        let url = that.BaseConfig + '/selectExpReportAll';
        let studentUserId;
        let courseId;
        if(this.level === 3) {
            studentUserId = that.formItem.studentUserId;
            courseId = '';
        } else {
            courseId = that.formItem.courseId;
            studentUserId = '';
        }
        let params = {
            title: that.taskTitle,
            name: that.name,
            studentUserId: studentUserId,
            courseId: courseId,
            pageNo: that.pageNo,
            pageSize: 10,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.reportList = data.data.data;
              that.total = data.data.total;
              console.log(data)
            } else {
              that.$Message.error(data.retMsg);
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

        del(id) {
            let that = this;
            let url = that.BaseConfig + '/deleteExpReport';
            let params = {
                expReportId: id,
            };
            that
                .$http(url, params, '', 'get')
                .then(res => {
                    if(res.data.retCode === 0) {
                        that.$Message.success('报告删除成功！');
                        this.getReportList();
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
  .user-manage {
    display: flex;
    justify-content: space-between;
  }
</style>
