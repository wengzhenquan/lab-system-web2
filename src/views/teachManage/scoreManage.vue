<template>
  <div class="box">
    <div class="search-title" style="margin-bottom: 10px" v-if="level === 1">
      <div>
        <div>
          <p>课程名称：</p>
          <Select v-model="courseId" style="width:170px;margin-top: 8px">
            <Option v-for="item in courList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <!--<div>-->
        <!--<p>学生姓名：</p>-->
        <!--<Input v-model="name" style="width: 150px;margin-top: 8px"/>-->
        <!--</div>-->
      </div>
      <Button type="primary" @click="searchScore"  style="height: 33px;margin-top: 8px;">搜索</Button>
    </div>
    <Table border :columns="columns" :data="achieveList" v-if="level === 1"></Table>
    <Table border :columns="columnsS" :data="achieveList" v-if="level === 3"></Table>
    <div style="margin-top: 20px; display: flex;justify-content: space-between">
      <div>
        <div v-if="level === 1">
          <Button type="primary" @click="allAchieve">一键评分</Button>
          <Button type="success" @click="choiceAchieveList">刷新</Button>
          <p style="color: red;margin-top: 5px">(计算公式：同课程的所有实验报告的平局成绩%  *  课程总分)</p>
        </div>
      </div>
      <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
    </div>

    <!--评分-->
    <Modal
      v-model="commitModal"
      title="课程得分"
      @on-ok="commitAchieve">
      <div>
        <div style="display:flex;">
          <Input v-model="achieve" placeholder="输入课程得分" style="width: 150px;margin-right: 20px"></Input>
          <Button type="primary" @click="autoCommit">智能评分</Button>
        </div>
        <p style="color: red;margin-top: 5px">(计算公式：同课程的所有实验报告的平局成绩%  *  课程总分)</p>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        current: 1,
        pageNo: 1,pageNo1: 1,
        total: 0,
        level: null,
        loginInfo: [],
        achieveList: [],   //学生成绩列表
        courceList: [],
        courList:[],        //此用户（教师）开设的课程列表
        columnsS: [
            {
                title: '序号',
                type: 'index',
                align: 'center',
                width: 80
            },
          {
            title: '课程名',
            key: 'courseName'
          },
          {
            title: '课任老师',
            key: 'teacherName',
          },
          {
            title: '总学分',
            key: 'totalScore'
          },
          {
            title: '最终成绩',
            key: 'achieve'
          },
        ],
        columns: [
          {
            title: '课程名',
            key: 'courseName',
            align: 'center',
          },
          {
            title: '学生',
            key: 'studentName',
              align: 'center',
          },
          {
            title: '总学分',
            key: 'totalScore',
              align: 'center',
          },
          {
            title: '课程得分',
            key: 'achieve',
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
                    display: params.row.achieve === 0? 'block': 'none',
                  },
                  on: {
                    click: () => {
                      this.commitModal = true;
                      this.achieve = params.row.achieve;
                      this.courseId = params.row.courseId;
                      this.studentId = params.row.studentId;
                    }
                  }
                }, '评分'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: params.row.achieve !== 0? 'block': 'none',
                  },
                  on: {
                    click: () => {
                      this.commitModal = true;
                      this.achieve = params.row.achieve;
                      this.courseId = params.row.courseId;
                      this.studentId = params.row.studentId;
                    }
                  }
                }, '修改成绩'),
              ]);
            }
          }
        ],
        achieve: null,
        courseId: null,
        studentId: null,
        teacherId: null,
        commitModal: false,
      }
    },

    created() {
      this.level = parseInt(this.Cookies.get('access'));
      this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if(this.level === 3) {
          this.getAchieveList();
          this.pageNo1 = 1;
          this.courceList = [];
          this.courList = [];
          this.getMyCourceList();
      } else {
          this.pageNo1 = 1;
          this.courceList = [];
          this.courList = [];
          this.getCourceList();
      }
    },

    methods: {
      //改变页数
      pageChange(val) {
        this.pageNo = val;
        if(this.level === 1) {
          this.choiceAchieveList();
        } else {
          this.getAchieveList();
        }
      },

      searchScore() {
          this.pageNo =1;
          if(this.level === 1) {
              this.choiceAchieveList();
          } else {
              this.getAchieveList();
          }
      },

      //学生查看成绩
      getAchieveList() {
        let that = this;
        let url = that.BaseConfig + '/selectAchieveAllByStudentId';
        let params = {
          pageNo: that.pageNo,
          pageSize: 10,
          studentId: that.loginInfo.userId,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.achieveList = data.data.data;
              that.total = data.data.total;
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //教师查看学生成绩
      choiceAchieveList() {
        let that = this;
        let url = that.BaseConfig + '/selectAchieveAllByTeacherId';
        let params = {
          pageNo: that.pageNo,
          pageSize: 10,
          courseId: that.courseId,
          teacherUserId: that.loginInfo.userId,
        };
        console.log(params)
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.achieveList = data.data.data;
              that.total = data.data.total;
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //获取此教师开设的课程列表
      getCourceList() {
        let that = this;
        let url = that.BaseConfig + '/selectCourseAll';
        let teacherUserId;
        that.level === 1 ? teacherUserId = that.loginInfo.userId : teacherUserId = '';
        let params = {
            pageNo: that.pageNo1,
            pageSize: 10,
            teacherUserId: teacherUserId,
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

      //获取学生已选课程列表
      getMyCourceList() {
            let that = this;
            let url = that.BaseConfig + '/selectCourseAllBy';
            let params = {
                studentId: that.loginInfo.userId,
                pageNo: that.pageNo1,
                pageSize: 10,
            };
            let data = null;
            that
                .$http(url, params, data, 'get')
                .then(res => {
                    data = res.data;
                    if(data.retCode === 0) {
                        that.courceList = data.data.data;
                        let total = data.data.total;
                        if(that.courceList.length < total) {
                            that.pageNo1++;
                            that.getMyCourceList();
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

      //智能评分
      autoCommit() {
        let that = this;
        let url = that.BaseConfig + '/autoAchieveOnStudent';
        let params = {
          courseId: that.courseId,
          studentId: that.studentId,
          teacherId: that.loginInfo.userId,
        };
        console.log(params)
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.$Message.success('评分完成');
              that.commitModal = false;
              that.choiceAchieveList();
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //课程成绩评分
      commitAchieve() {
        let that = this;
        let url = that.BaseConfig + '/updateAchieveBy';
        let params = {
          achieve: that.achieve,
          courseId: that.courseId,
          studentId: that.studentId,
          teacherId: that.loginInfo.userId,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            console.log(res)
            data = res.data;
            if(data.retCode === 0) {
              that.$Message.success('评分完成');
              that.choiceAchieveList();
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //一键智能评分
      allAchieve() {
        if(this.courseId === null) {
          this.$Message.warning('请选择课程');
          return;
        }
        let that = this;
        let url = that.BaseConfig + '/autoAchieveOnCourse';
        let params = {
          courseId: that.courseId,
          teacherId: that.loginInfo.userId,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            console.log(res)
            data = res.data;
            if(data.retCode === 0) {
              that.$Message.warning(data.data)
            } else {
              that.$Message.error(data.retMsg);
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
