<template>
    <div class="main-body reward">
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="150">
            <FormItem label="推广会员可提现比例：" prop="resKey">
                <div style="position: relative;">
                    <Input  v-model="formCustom.resKey" placeholder="示例：70%，不设置，默认100%"></Input>
                    <p class="tips">提示：可提现比例为会员推广收益可提现部分，不可提现部分设置单独账户</p>
                </div>
            </FormItem>
            <FormItem label="推广会员收益条件：" prop="value">
                <div style="position: relative;">
                    <Input v-model="formCustom.value" placeholder="示例：充值卡余额大于10，不设置，默认不做限制"></Input>
                    <p class="tips">提示：充值卡余额应大于多少，推广会员才能产生推广收益，此为触发阈值设置</p>
                </div>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formCustom')" class="btn btn-blue">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                formCustom: {
                    resKey: '',
                    value: ''
                },
                sysResourcesConfigDtoList: [],
                ruleCustom: {
                    resKey: [
                        {required: true, trigger: 'blur' }
                    ],
                    value: [
                        {required: true, trigger: 'blur' }
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
                        this.setReword();
                    } else {
                        this.$Message.error('请填写完整!');
                    }
                });
            },
            setReword() {   //设置奖励
                let that = this;
                let url = that.serviceurl + '/backstage/sys/config/modify';
                that.sysResourcesConfigDtoList[0]= that.formCustom;
                let data = that.sysResourcesConfigDtoList;
                that
                    .$http(url, '', data, "post")
                    .then(res=> {
                        if (res.data.retCode === 0) {
                            that.$Message.success('修改成功');
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
    .reward {
        /deep/ .ivu-input {
            width: 300px;
        }
        .tips {
            position: absolute;
            top: 0;
            left: 310px;
            color: red;
        }
        button {
            border-radius: 20px;
            width: 100px;
        }
    }
</style>