<template>
    <div>
        <div style="display: flex;margin-bottom: 10px;">
            <Button type="primary" style="height: 33px" @click="addIdent">添加身份</Button>
        </div>
        <Table border ref="selection" :columns="columns4" :data="identityInfo"></Table>
        <!--添加身份信息-->
        <Modal
                v-model="isIdentity"
                title="添加身份"
                @on-ok="ok"
        >
            <div>
                <Form :model="formItem" :label-width="80">
                    <FormItem label="身份：">
                        <Input v-model="formItem.identityName"></Input>
                    </FormItem>
                    <FormItem label="权限：">
                        <Input v-model="formItem.level"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
        <!--修改身份信息-->
        <Modal
                v-model="isEditIdent"
                title="编辑身份信息"
                @on-ok="editIdentity"
        >
            <div>
                <Form :model="formItem" :label-width="80">
                    <FormItem label="身份：">
                        <Input v-model="formItem.identityName"></Input>
                    </FormItem>
                    <FormItem label="权限：">
                        <Input v-model="formItem.level"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                current: 1,
                identityInfo: [],
                columns4: [
                    {
                        title: '身份',
                        key: 'identityName',
                    },
                    {
                        title: '权限',
                        key: 'level'
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
                                            this.isEditIdent = true;
                                            this.editIdent(params.row);
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }
                    }
                ],
                isIdentity: false,    //添加身份悬浮框是否弹出
                isEditIdent:  false,  //编辑身份悬浮框是否弹出
                formItem: {
                    identityName: '',
                    level: '',
                },
                id: '',
            }
        },

        created() {
            this.getIdentityList();
        },

        methods: {
            //获取身份列表
            getIdentityList() {
                let that = this;
                let url = that.BaseConfig + '/selectIdentityList';
                let data = null;
                that
                    .$http(url, '', data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.identityInfo = data.data;
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            addIdent() {
                this.isIdentity = true;
                this.formItem = {
                    identityName: '',
                        level: '',
                };
            },
            //添加身份
            ok () {
                let that = this;
                let url = that.BaseConfig + '/insertIdentity';
                let data = that.formItem;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('添加身份成功');
                            this.getIdentityList();
                            that.formItem = {
                                identityName: '',
                                level: '',
                            }
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            editIdent(row) {
                this.id = row.id;
                this.formItem = row;
                this.isEditIdent = true;
            },

            //编辑身份信息
            editIdentity() {
                let that = this;
                let url = that.BaseConfig + '/updateIdentity';
                let data = {
                    id: that.id,
                    identityName: that.formItem.identityName,
                    level: that.formItem.level,
                };
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('修改身份成功');
                            this.getIdentityList();
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },
        }
    }
</script>

<style scoped>

</style>
