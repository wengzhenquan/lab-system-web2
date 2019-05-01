<template>
    <div class="main-body edit-pwd">
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100">
            <FormItem label="旧密码：" prop="oldPassword">
                <Input type="password" v-model="formCustom.oldPassword"></Input>
            </FormItem>
            <FormItem label="新密码：" prop="newPassword">
                <Input type="password" v-model="formCustom.newPassword"></Input>
            </FormItem>
            <FormItem label="新密码确认：" prop="passwdCheck">
                <Input type="password" v-model="formCustom.passwdCheck"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formCustom')">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            const valiPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入旧密码'));
                } else {
                    if (this.formCustom.newPassword  !== '') {
                        this.$refs.formCustom.validateField('newPassword');
                    }
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value === this.formCustom.oldPassword) {
                    callback(new Error('新旧密码不能一致，请重新设置'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formCustom.newPassword ) {
                    callback(new Error('密码不一致，请重新输入!'));
                } else {
                    callback();
                }
            };
            return {
                formCustom: {
                    oldPassword: '',
                    newPassword: '',
                    passwdCheck: '',
                },
                ruleCustom: {
                    oldPassword: [
                        {required: true, validator: valiPass, trigger: 'blur' }
                    ],
                    newPassword: [
                        {required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        {required: true, validator: validatePassCheck, trigger: 'blur' }
                    ]
                }
            };
        },

        created () {

        },

        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.modifyPwd();
                    } else {
                        this.$Message.error('信息填写不完整!');
                    }
                });
            },
            modifyPwd() {   //修改密码
                let that = this;
                let url = that.serviceurl + '/backstage/admin/modifyPwd';
                let data = {
                    username: that.Cookies.get('user'),
                    oldPassword: that.formCustom.oldPassword,
                    newPassword: that.formCustom.newPassword,
                };
                that
                    .$http(url, '', data, "post")
                    .then(res=> {
                        if (res.data.retCode === 0) {
                            that.$Message.success('密码修改成功');
                            that.$router.push({
                                name: 'login'
                            })
                        } else {
                            this.$Message.warning(res.data.retMsg || '修改失败！');
                        }
                    })
                    .catch(e => {
                        that.$Message.warning('请求错误！');
                    })
            },
        }
    };
</script>

<style lang="less" scoped>
.edit-pwd {
    /deep/ .ivu-input {
        width: 300px;
    }
    /deep/ .ivu-form-item-error-tip {
        top: 5px;
        left: 310px;
    }
    button {
        border-radius: 20px;
        width: 100px;
    }
}
</style>