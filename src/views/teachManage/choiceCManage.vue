<template>
  <div>
    <div class="user-manage">
      <div style="display: flex; justify-content: flex-end;margin-top: 10px;margin-bottom: 10px">
        <Select v-model="sortValue" style="width:150px">
          <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <div style="width: 270px;margin-left: 3px"><Input search enter-button="搜索" placeholder="输入要查找的内容" v-model="name" /></div>
      </div>
    </div>
    <Table border ref="selection" :columns="columns4" :data="courceList"></Table>
    <div style="margin-top: 20px; display: flex;justify-content: flex-end">
      <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
    </div>

    <!--选课-->
    <Modal
      v-model="isChoice"
      title="加入此课程"
      @on-ok="ChoiceC"
      >
      <div>
        {{cList}}
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
        cList: '',           //某个课程信息
        pageNo: 1,
        total: 0,
        sortList: [
          {
            value: 'userName',
            label: '学号'
          },
          {
            value: 'name',
            label: '姓名'
          },
        ],    //查找条件
        sortValue:'',
        name: '',     //查找内容
        columns4: [
          {
            title: '课程名',
            key: 'courseName'
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
            title: '课任老师',
            key: 'name',
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
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.isChoice = true;
                      this.cList = params.row;
                    }
                  }
                }, '选课'),
              ]);
            }
          }
        ],
        isChoice: false,
      }
    },

    created() {
      this.getCourceList();
    },

    methods: {
      //改变页数
      pageChange(val) {
        this.pageNo = val;
        this.getInfo();
      },
      //获取课程列表
      getCourceList() {
        let that = this;
        let url = that.BaseConfig + '/selectCourseAll';
        let params = {
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

      //加入课程
      ChoiceC() {

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
