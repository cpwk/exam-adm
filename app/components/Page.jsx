import React from 'react';

import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

class Page extends React.Component {
    render() {
        return (
            <LocaleProvider locale={zhCN} style={{height: '100%'}}>
                {this.props.children}
            </LocaleProvider>
        )

    }
}

export default Page;