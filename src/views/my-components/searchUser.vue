<template>
  <div>
    <Input class="cc-w-300" v-model="search" placeholder></Input>
    <Button type="primary" @click="searchUser">搜索</Button>
    <div class="res-list">
      <CheckboxGroup v-model="checked" v-if="!isRadio" @on-change="checkChange">
        <p v-for="(item,index) in resList" :key="index">
          <Checkbox :label="index">{{`${item.userName} &nbsp;&nbsp;(${item.userPhone})`}}</Checkbox>
        </p>
      </CheckboxGroup>
      <RadioGroup v-else v-model="redio" @on-change="radioChange">
        <p v-for="(item,index) in resList" :key="index">
          <Radio :label="index">{{`${item.userName}&nbsp;&nbsp;(${item.userPhone})`}}</Radio>
        </p>
      </RadioGroup>
    </div>
  </div>
</template>

<script>
function indexOf (arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].userId === item.userId) {
            return i;
        }
    }
    return -1;
}
export default {
    props: {
        isRadio: {
            type: Boolean,
            default: false
        },
        url: {
            type: String,
            default: ''
        },
        checkedData: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data () {
        return {
            checked: [],
            userList: [],
            search: '',
            resList: [],
            redio: ''
        };
    },
    created () {
        this.getUser();
    },
    methods: {
    // 搜索用户
        getUser () {
            this.$http({
                url: this.serviceurl + '/weteam-service/' + this.url,
                method: 'get'
            })
                .then(res => {
                    if (res.data.retCode === 0 && res.data.data) {
                        this.userList = res.data.data;
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },
        checkChange (val) {
            let res = [];
            val.forEach(item => {
                res.push(this.resList[item]);
            });
            this.$emit('val', res);
        },
        radioChange (val) {
            this.$emit('val', this.resList[val]);
        },
        searchUser () {
            const list = this.userList;
            let arr = [];
            const reg = new RegExp(this.search);
            for (var i = 0; i < list.length; i++) {
                // 如果字符串中不包含目标字符会返回-1
                if (
                    (list[i].userName && list[i].userName.match(reg)) ||
          (list[i].userPhone && list[i].userPhone.match(reg))
                ) {
                    arr.push(list[i]);
                }
            }
            this.resList = arr;
            this.checkedChange();
        },
        delChecked (index) {
            this.checked.splice(index, 1);
        },
        checkedChange () {
            this.checked = [];
            this.checkedData.forEach(item => {
                let index = indexOf(this.resList, item);
                if (index > -1) {
                    this.checked.push(index);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.res-list {
  width: 300px;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #dddee1;
  margin-top: 10px;
  padding: 10px;
}
</style>
