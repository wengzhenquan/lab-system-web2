<template>
    <div class="edit-pwd">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="border: 1px solid #ccc;padding: 12px">
        <FormItem label="用户名" prop="userName">
          <Input v-model="formValidate.userName" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="新密码" prop="pwd">
          <Input type="password" v-model="formValidate.pwd" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="pwdCheck">
          <Input type="password" v-model="formValidate.pwdCheck" style="width: 300px"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" style="margin: 0 20px" @click="handleSubmit('formValidate')">确认</Button>
        </FormItem>
      </Form>
    </div>
</template>

<script>
    export default {
        data() {
          const validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.formValidate.pwdCheck !== '') {
                // 对第二个密码框单独验证
                this.$refs.formValidate.validateField('pwdCheck');
              }
              callback();
            }
          };
          const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.formValidate.pwd) {
              callback(new Error('密码不一致，请重新输入!'));
            } else {
              callback();
            }
          };
            return {
              formValidate: {
                userName: '',
                pwd: '',
                pwdCheck: '',
              },
              userId: null,
              ruleValidate: {
                userName: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
                pwd: [{ validator: validatePass, required: true, trigger: 'blur' }],
                pwdCheck: [{ validator: validatePassCheck, required: true, trigger: 'blur' }],
              }
            }
        },

        methods: {
          handleSubmit(name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.getUserName();
              } else {
                this.$Message.error('*为必填项!');
              }
            })
          },
          getUserName() {
            let that = this;
            let url = that.BaseConfig + '/selectUsersAll';
            let params = {
              userName: that.formValidate.userName,
              pageNo: 1,
              pageSize: 10
            };
            that
              .$http(url,params, '', 'get')
              .then(res => {
                if(res.data.retCode === 0) {
                  that.userId = res.data.data.data[0].userId;
                  that.changePwd(that.userId);
                } else {
                  that.$Message.error(res.data.retMsg);
                }
              })
              .catch(err => {
                that.$Message.error('请求错误');
              })
          },

          changePwd(id) {
            let that = this;
            let url = that.BaseConfig + '/updatePwdById';
            let params = {
              userId: id,
              pwd: that.formValidate.pwd
            };
            that
              .$http(url,params, '', 'GET')
              .then(res => {
                if(res.data.retCode === 0) {
                  that.$Message.success('修改成功');
                  this.formValidate={
                        userName: '',
                        pwd: '',
                        pwdCheck: '',
                    };
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
.edit-pwd {
  background-color: #fff;
  border-radius: 5px;
}
</style>
