<template>
  <div>
    <div style="display:flex;margin-bottom: 8px;margin-top: 8px">
      <div style="width: 40%">
        课程名称：
        <Select v-model="formItem.courseId" style="width:170px" @on-change="choiceCource">
          <Option v-for="item in courList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div>
        实验课题：
        <Select v-model="formItem.courseId" style="width:170px">
          <Option v-for="item in courList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <Table border ref="selection" :columns="columns4" :data="reportList"></Table>
    <div style="margin-top: 20px; display: flex;justify-content: flex-end">
      <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
    </div>
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
        formItem: {
          courseId: null,
          score: null,
          teskId: null,           //不能为空
          studentUserId: null,    //不能为空
          updateTime: '',         //学生更新实验报告的时间
        },
        columns4: [
          {
            title: '实验标题',
            key: 'title'
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
                        path: './reportInfo',
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
            key: 'courseName'
          },
          {
            title: '提交时间',
            key: 'updateTime'
          },
          {
            title: '学生',
            key: 'name'
          },
          {
            title: '实验分',
            key: 'score',
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.level === 1?'block':'none',
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: './editReport',
                        query: {
                          expReportId: params.row.id,
                        }
                      })
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
                    display: this.level === 3?'block':'none',
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: './editReport',
                        query: {
                          expReportId: params.row.id,
                        }
                      })
                    }
                  }
                }, '修改'),
              ]);
            }
          }
        ],
      }
    },

    created() {
      this.getCourceList();
      //如果学生，直接显示学生所提交的实验报告
      this.formItem.studentUserId = this.$store.state.loginInfo.userId;
      this.formItem.courseId = this.$route.query.courseId;
      this.level = this.$store.state.loginInfo.level;
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

      //获取此用户开设的课程列表
      getCourceList() {
        let that = this;
        let url = that.BaseConfig + '/selectCourseAll';
        let params = {
          pageNo: that.pageNo1,
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

      //选择课程，显示对应已有的实验任务
      choiceCource(){
        this.getReportList();
      },

      //获取某课程下的实验报告列表
      getReportList() {
        let that = this;
        let url = that.BaseConfig + '/selectExpReportAll';
        let params;
        if(this.level === 3) {
          params = {
            pageNo: that.pageNo,
            pageSize: 10,
            studentUserId: that.formItem.studentUserId,
          };
        } else {
          params = {
            pageNo: that.pageNo,
            pageSize: 10,
            courseId: that.formItem.courseId,
          };
        }
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

    }
  }
</script>

<style lang="less" scoped>
  .user-manage {
    display: flex;
    justify-content: space-between;
  }
</style>
