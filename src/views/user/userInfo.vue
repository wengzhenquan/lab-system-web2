<template>
    <div class="box">
        <Tabs type="card">
            <TabPane label="修改资料">
                <Form :model="users" :label-width="90">
                    <FormItem label="ID">
                        <Input v-model="users.id" disabled style="width: 300px;"></Input>
                    </FormItem>
                    <FormItem label="用户名">
                        <Input v-model="users.userName" disabled style="width:300px"></Input>
                    </FormItem>
                    <FormItem label="姓名">
                        <Input v-model="users.name"  style="width: 300px"></Input>
                    </FormItem>
                    <FormItem label="身份">
                        <Input v-model="users.identityName" disabled  style="width: 300px"></Input>
                    </FormItem>
                    <FormItem label="职位">
                        <Input v-model="users.job"  style="width: 300px"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="editUserSubmit">立即提交</Button>
                    </FormItem>
                </Form>
            </TabPane>

            <TabPane label="修改密码">
                <Form ref="formCustom" :model="formCustom" :rules="ruleCustom"  :label-width="90">
                    <FormItem label="用户名" prop="userName">
                        <Input v-model="formCustom.userName" disabled style="width:300px"></Input>
                    </FormItem>
                    <FormItem label="旧密码" prop="oldPwd">
                        <Input type="password" v-model="formCustom.oldPwd"  placeholder="请输入密码"  style="width: 300px"></Input>
                    </FormItem>
                    <FormItem label="新密码" prop="newPwd">
                        <Input type="password" v-model="formCustom.newPwd" placeholder="请输入密码"  style="width: 300px"></Input>
                    </FormItem>
                    <FormItem label="重复密码" prop="passwdCheck">
                        <Input type="password" v-model="formCustom.passwdCheck"  placeholder="请输入密码"  style="width: 300px"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formCustom')">立即提交</Button>
                    </FormItem>
                </Form>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码！'));
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
                    callback(new Error('请再次输入密码！'));
                } else if (value !== this.formCustom.newPwd) {
                    callback(new Error('密码不一致，请重新输入!'));
                } else {
                    callback();
                }
            };
            return {
                loginInfo: [],
                users: {
                    id: null,
                    userName: '',
                    identityId: null,
                    name: '',
                    identityName: '',
                    job: '',
                },
                formCustom: {
                    userName: '',
                    oldPwd: '',
                    newPwd: '',
                    passwdCheck: '',
                },
                ruleCustom: {
                    newPwd: [
                        { required: true,validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true,validator: validatePassCheck, trigger: 'blur' }
                    ],
                    oldPwd: [
                        { required: true,message: '请输入旧密码', trigger: 'blur' }
                    ]
                }
            }
        },

        created() {
            this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
            this.getUserInfo();
        },

        methods: {
            getUserInfo() {
                this.users.id = this.loginInfo.userId;
                this.users.userName = this.loginInfo.userName;
                this.formCustom.userName = this.loginInfo.userName;
                this.users.name = this.loginInfo.name;
                this.users.identityName = this.loginInfo.identityName;
                this.users.identityId = this.loginInfo.identityId;
                this.users.job = this.loginInfo.job;
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitEdit();
                    } else {
                        this.$Message.error('信息填写不完整!');
                    }
                })
            },
            submitEdit(){
                let that = this;
                let url = that.BaseConfig + '/updatePwd';
                let params = {
                    userName: that.formCustom.userName,
                    oldPwd: that.formCustom.oldPwd ,
                    newPwd: that.formCustom.newPwd,
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('密码修改成功！');
                            that.formCustom = {
                                userName: '',
                                    oldPwd: '',
                                    newPwd: '',
                                    passwdCheck: '',
                            }
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            editUserSubmit() {
                let that = this;
                let url = that.BaseConfig + '/updateUser';
                let data = that.users;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('个人信息修改成功！');
                            this.getInfo();
                        } else {
                            that.$Message.error(res.data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },
            getInfo() {
                let that = this;
                let url = that.BaseConfig + '/selectByUserId';
                let params = {
                    userId: that.users.id
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            localStorage.setItem('loginInfo', JSON.stringify(data.data));
                            this.users.name = data.data.name;
                            this.users.job = data.data.job;
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },
        },
    }
</script>

<style scoped>

</style>