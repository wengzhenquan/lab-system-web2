<template>
    <div class="box">
        <div class="dev-sort">
            <Button type="primary" style="height: 33px;" @click="isAdd = true">添加设备类别</Button>
        </div>
        <div>
            <Table border ref="selection" :columns="columns4" :data="devSortList" ></Table>
            <div style="margin-top: 20px; display: flex;justify-content: flex-end">
                <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
            </div>
        </div>
        <!--添加设备类型-->
        <div>
            <Modal
                    v-model="isAdd"
                    title="添加设备类型"
                    @on-ok="addDevSort">
                <div>
                    <Form :model="equipmentClass" :label-width="80">
                        <FormItem label="设备类型：">
                            <Input v-model="equipmentClass.typeName"></Input>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        </div>

        <!--编辑设备类型-->
        <div>
            <Modal
                    v-model="isEdit"
                    title="编辑设备类型"
                    @on-ok="editDevSort"
                    @on-cancel="equipmentClass.typeName = ''">
                <div>
                    <Form :model="equipmentClass" :label-width="80">
                        <FormItem label="设备类型：">
                            <Input v-model="equipmentClass.typeName"></Input>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                level: null,
                current: 1,
                devSortList: [],     //设备分类列表
                pageNo: 1,
                total: 0,
                isAdd: false,
                isEdit: false,
                editId: null,
                equipmentClass: {
                    typeName: '',
                },
                columns4: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '设备类别',
                        key: 'typeName',
                        align: 'center'
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
                                            this.editId = params.row.id;
                                            this.equipmentClass.typeName = params.row.typeName;
                                            this.isEdit = true;
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }
                    }
                ],
            }
        },

        created() {
            this.getDevSort();
            this.level = parseInt(this.Cookies.get('access'));
        },

        methods: {
            //改变页数
            pageChange(val) {
                this.pageNo = val;
                this.getDevSort();
            },
            //获取设备分类列表
            getDevSort() {
                let that = this;
                let url = that.BaseConfig + '/selectEquipmentClassAll';
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
                            that.devSortList = data.data.data;
                            console.log(that.devSortList)
                            that.total = data.data.total;
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //添加设备类型
            addDevSort() {
                let that = this;
                let url = that.BaseConfig + '/insertEquipmentClass';
                let data = that.equipmentClass;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('添加设备类型成功');
                            that.isAdd = false;
                            that.equipmentClass.typeName = '';
                            this.getDevSort();
                        } else {
                            that.$Message.error(res.data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //编辑设备类别
            editDevSort() {
                let that = this;
                let url = that.BaseConfig + '/updateEquipmentClass';
                let data = {
                    id: that.editId,
                    typeName: that.equipmentClass.typeName
                };
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('修改设备类型成功');
                            that.equipmentClass.typeName = '';
                            this.getDevSort();
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
    .user-manage {
        display: flex;
        justify-content: space-between;
    }
    .dev-sort {
        display: flex;margin-bottom: 10px
    }
</style>
