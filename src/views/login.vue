 <template>
    <div class="login-box">
      <div class="login-title">
        <img src="../images/shiyanshixitong.png" alt="">
      </div>
      <div class="controduct">
        <p>本系统基于实验室管理方案，致力于提高教学质量、简化工作流程、节约人力资源而开发。</p>
        <p>系统有主要功能如下：</p>
        <p><span>教学管理</span>：教师发布课程供学生选课，教师发布实验任务，学生提交实验报告，评</p>
        <p style="text-indent: 5em">定学生成绩。</p>
        <p><span>实验室管理</span>：对实验教室进行规范化管理。</p>
        <p><span>设备管理</span>：设备管理员对实验室设备进行出库入库管理。</p>
      </div>
      <div>
        <div class="login">
          <p>登录</p>
          <p>用户名：<Input v-model="userName" placeholder="请输入账号" style="width: 222px" /></p>
          <p>密&nbsp;&nbsp; 码：<Input v-model="pwd" type="password" placeholder="请输入密码" style="width: 222px" /></p>
          <div class="login-btn"><Button type="primary" style="width: 100%" @click="login">登录</Button></div>
          <div class="choiceIde">
            <RadioGroup v-model="levelValue">
              <Radio label="学生"></Radio>
              <Radio label="教师"></Radio>
              <Radio label="设备管理员"></Radio>
              <Radio label="系统管理员"></Radio>
            </RadioGroup>
          </div>
          <p><span style="color: #2d78f4" @click="isRegister = true">免费注册</span><span>忘记密码？</span></p>
        </div>
      </div>

      <p style="position: absolute;left: 40%;bottom: 40px;font-size: 15px;font-weight: 600;color: #000;letter-spacing: 2px">2019.05 长春理工大学光电信息学院 学生 毕业设计作品</p>


      <!--注册-只能是学生-->
      <Modal
        v-model="isRegister"
        title="注册账号"
        :mask-closable="isAuto"
        :loading="true"
        @on-ok="registerUser('registerInfo')"
      >
        <div>
          <Form ref="registerInfo" :model="registerInfo" :rules="ruleCustom" :label-width="80">
            <FormItem label="账户：" prop="userName">
              <Input v-model="registerInfo.userName" style="width:200px"></Input>
            </FormItem>
            <FormItem label="名称：" prop="name">
              <Input v-model="registerInfo.name" style="width:200px"></Input>
            </FormItem>
            <FormItem label="密码：" prop="pwd">
              <Input type="password" v-model="registerInfo.pwd" style="width:200px"></Input>
            </FormItem>
            <FormItem label="确认密码：" prop="passwdCheck">
              <Input type="password" v-model="registerInfo.passwdCheck" style="width:200px"></Input>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
        data() {
          const validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入登录密码'));
            } else {
              if (this.registerInfo.passwdCheck !== '') {
                // 对第二个密码框单独验证
                this.$refs.registerInfo.validateField('passwdCheck');
              }
              callback();
            }
          };
          const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入登录密码'));
            } else if (value !== this.registerInfo.pwd) {
              callback(new Error('登录密码不一致，请重新输入!'));
            } else {
              callback();
            }
          };
            return {
              userName: '',
              pwd: '',
              levelValue: '学生',
              isRegister: false,
              isAuto: false,
              registerInfo: {
                userName: '',
                name: '',
                pwd:'',
                identityId: 4,
                passwdCheck: '',
              },
              ruleCustom: {
                userName: [
                  { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                name: [
                  { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                pwd: [
                  {required: true, validator: validatePass, trigger: 'blur' }
                ],
                passwdCheck: [
                  {required: true, validator: validatePassCheck, trigger: 'blur' }
                ],
              }
            }
        },

        methods: {
          login() {
            let that = this;
            let url = that.BaseConfig + '/login';
            let level;
            if(that.levelValue === '系统管理员') {
              level = 0;
            } else if(that.levelValue === '设备管理员') {
              level = 2;
            } else if(that.levelValue === '教师') {
              level = 1;
            } else if(that.levelValue === '学生') {
              level = 3;
            }
            let params = {
              userName: that.userName,
              pwd: that.pwd,
              level: level,
            };
            let data = null;
            that
              .$http(url, params, data, 'get')
              .then(res => {
                console.log(res);
                if(res.data.retCode === 0) {
                    this.Cookies.set('token',true)
                    localStorage.setItem('loginInfo', JSON.stringify(res.data.data))
                    this.Cookies.set('access',level)
                  that.$router.push({
                    path: '/home',
                  })
                } else {
                  that.$Message.error(res.data.retMsg)
                }
              })
              .catch(err => {
                this.$Message.error('请求错误');
              })
          },

          //注册
          registerUser(name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                let that = this;
                let url = that.BaseConfig + '/insertUser';
                let data = that.registerInfo;
                that
                  .$http(url, '', data, 'post')
                  .then(res => {
                    if(res.data.retCode === 0) {
                      that.$Message.success('注册成功');
                      setTimeout(()=> {
                        that.isRegister = false;
                      },800)
                    } else {
                      that.$Message.error(res.data.retMsg);
                      setTimeout(()=> {
                        that.isRegister = false;
                      },1000)
                    }
                  })
                  .catch(err => {
                    that.$Message.error('请求错误');
                    setTimeout(()=> {
                      that.isRegister = false;
                    },1000)
                  });
              } else {
                this.$Message.error('注册信息不完整!');
                setTimeout(()=> {
                  this.isRegister = false;
                },1000)
              }
            });
          },
        }
    }
</script>

<style lang="less" scoped>
  .login-box {
    width: 100%;
    height: 100vh;
    background: url("../images/login_bg.png");
    background-size: 100% 100%;
    position: relative;
    .login-title {
      width: 50%;
      margin: 0 auto;
     img {
       width: 100%;
     }
    }
  }
  .login {
    position: absolute;
    /*left: 38%;*/
    right: 12%;
    top: 26%;
    padding: 40px;
    border: 1px solid #fff;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.4);
    /deep/ .ivu-input {
      border-color: #2d78f4;
    }
    p {
      margin-top: 15px;
      &:nth-child(1) {
        font-size: 20px;
        text-align: center;
        font-weight: 600;
        letter-spacing: 2px;
        color: #2d78f4;
      }
      &:nth-last-child(1) {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
    }
    .login-btn {
      margin: 15px 0 10px;
    }

    .choiceIde {
      margin-top: 18px;
      font-size: 14px;
    }
  }
  .controduct {
    border-radius: 10px;
    background-color: rgba(255,255,255,0.4);
    width: 40%;
    margin-left: 11%;
    padding: 40px;
    p {
      font-size: 15px;
      line-height: 30px;
      font-weight: 600;
      color: #000;
      letter-spacing: 2px;
      &:nth-child(1) {
        text-indent: 2em;
        font-style: italic;
        padding-bottom: 15px;
      }
      &:nth-child(2) {
        font-style: italic;
      }
      span {
        color: blue;
      }
    }
  }
</style>
