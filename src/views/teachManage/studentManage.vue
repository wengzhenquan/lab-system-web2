<template>
  <div class="box">
    <div class="search-title">
      <div>
        <div>
          <p>课程名称：</p>
          <Select v-model="courseId" style="width:170px;margin-top: 8px" >
            <Option v-for="item in courList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <!--<div>-->
          <!--<p>学生姓名：</p>-->
          <!--<Input v-model="name" style="width: 150px;margin-top: 8px"/>-->
        <!--</div>-->
      </div>
      <Button type="primary" @click="searchStudent"  style="height: 33px;margin-top: 8px;">搜索</Button>
    </div>
    <div class="user-manage">
      <Button type="primary" style="height: 30px;" @click="addStu(2)">添加学生进课程</Button>
      <Button type="success" style="height: 30px;" @click="getAllStudent">全部学生</Button>
    </div>
    <Table border ref="selection" :columns="columns4" :data="studentList"></Table>
    <div style="margin-top: 20px; display: flex;justify-content: flex-end">
      <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
    </div>

    <!--添加学生-->
    <div v-if="level === 1">
      <Modal
        v-model="isAdd"
        title="添加学生进课程"
        :footer-hide="true"
        >
        <div style="padding: 12px">
          <div style="margin-bottom: 15px">
            <Input v-model="userName" placeholder="学号"  style="width: 150px"/>
            <Button type="primary" @click="searchStu">搜索</Button>
          </div>
          <Table border ref="selection" :columns="columnsS" :data="student"></Table>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        current: 1,
        studentList: [],     //学生列表
        pageNo: 1,
        pageNo1: 1,
        total: 0,
        columns4: [
          {
            title: '学生姓名',
            key: 'studentName'
          },
          {
            title: '课程名',
            key: 'courseName'
          },
          {
            title: '教师',
            key: 'teacherName'
          },
        ],
        courceList: [],
        courList: [{
            value: -1,
            label: '全部'
        }],      //此教师开设的课程列表
        courseId: null,
        level: null,
        loginInfo: [],
        isAdd:false,     //添加学生进课程modal框
        userName: '',    //输入添加学生的学号
        userInfo: '',    //搜索是否有此学生信息
        student: [],
        addFlag: 1,   //1-添加学生 ，2-添加学生进课程
        columnsS: [
          {
            title: '学号',
            key: 'userName'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '身份',
            key: 'identityName'
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
                      this.addStudent(params.row.userId);
                    }
                  }
                }, '添加'),
              ]);
            }
          }
        ],
      }
    },

    created() {
      this.level = parseInt(this.Cookies.get('access'));
      this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      this.courseId = this.$route.query.courseId;
      this.getAllStud();
      this.getCourceList();    //获取此教师开设的课程列表
    },

    methods: {
      //改变页数
      pageChange(val) {
        this.pageNo = val;
        this.getStudentList();
      },

      getAllStudent() {
          this.pageNo = 1;
          this.getAllStud();
      },
      getAllStud() {  //获取老师下所有学生列表
          let that = this;
          let url = that.BaseConfig + '/selectStudentByTeacherId';
          let params = {
              teacherUserId: that.loginInfo.userId,
              pageNo: that.pageNo,
              pageSize: 10,
          };
          let data = null;
          that
              .$http(url, params, data, 'get')
              .then(res => {
                  data = res.data;
                  console.log(data)
                  if(data.retCode === 0) {
                      that.studentList = data.data.data;
                      that.total = data.data.total;
                  }
              })
              .catch(err => {
                  that.$Message.error('请求错误');
              })
      },

      //添加学生模态框，先选择课程才能选择添加学生
      addStu(num) {
        this.addFlag = num;
        if(num === 2) {
            if(this.courseId === undefined || this.courseId === null) {
                this.$Message.warning('请先选择课程')
            } else {
                this.isAdd = true;
            }
        } else {
            this.isAdd = true;
        }

      },

      searchStudent() {
          this.pageNo = 1;
          this.getStudentList();
      },

      //获取某课程的学生列表
      getStudentList() {
        let that = this;
        let url = that.BaseConfig + '/selectStudentByCourseId';
        let params = {
          courseId: that.courseId,
          pageNo: that.pageNo,
          pageSize: 10,
        };
        let data = null;
        that
          .$http(url, params, data, 'get')
          .then(res => {
            data = res.data;
            if(data.retCode === 0) {
              that.studentList = data.data.data;
              that.total = data.data.total;
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
              }
              that.courceList.map(item=> {
                that.courList.push({
                  value: item.id,
                  label: item.courseName
                })
              })
            } else {
              that.$Message.error(data.retMsg);
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //查找是否有此学生
      searchStu() {
        let that = this;
        that.student = [];
        let url = that.BaseConfig + '/selectUsersAll';
        let params = {
          userName: that.userName,
          pageNo: 1,
          pageSize: 10,
        };
        let data = null;
        that
          .$http(url, params , data, 'get')
          .then(res =>{
            data = res.data;
            if(data.retCode === 0) {
              that.userInfo = data.data.data;
              that.userInfo.map(item=> {
                if(item.level === 3) {
                  that.student = that.student.concat(item);
                }
              })
            }
          })
          .catch(err => {
            that.$Message.error('请求错误');
          })
      },

      //添加学生
      addStudent(studentId) {
        let that = this;
        if(that.addFlag === 1) {
            let url = that.BaseConfig + '/insertStudentToTeacher';
            let params = {
                studentId: studentId,
                teacherId: that.loginInfo.userId,
            };
            let data = null;
            that
                .$http(url, params, data, 'get')
                .then(res => {
                    data = res.data;
                    if(data.retCode === 0) {
                        this.$Message.success('添加成功');
                        that.isAdd = false;
                        this.getAllStud();
                    } else {
                        that.$Message.error(data.retMsg);
                    }
                })
                .catch(err => {
                    that.$Message.error('请求错误');
                })
        } else {
            let url = that.BaseConfig + '/insertStudentToCourse';
            let params = {
                studentId: studentId,
                teacherId: that.loginInfo.userId,
                courseId: that.courseId,
            };
            let data = null;
            that
                .$http(url, params, data, 'get')
                .then(res => {
                    data = res.data;
                    if(data.retCode === 0) {
                        this.$Message.success('添加成功');
                        that.isAdd = false;
                        this.getStudentList();
                    } else {
                        that.$Message.error(data.retMsg);
                    }
                })
                .catch(err => {
                    that.$Message.error('请求错误');
                })
        }
      },
    }
  }
</script>

<style lang="less" scoped>

</style>
