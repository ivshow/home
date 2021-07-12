/*
 * @Author : hu.jiadong
 * @Date   : 2020-05-12 10:59
 * @WeChat : hjd389042136
 * @Email  : vshow@huxiaodo.com
 * @Blog   : http://g.huxiaodo.com
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { LaunchApp, isIos } from 'web-launch-app';
import { Toast } from 'vant';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const lanchApp = new LaunchApp();

export const getRelativeTime = time => {
  const dayjsTime = dayjs(time);
  const relativeTime = dayjsTime.fromNow();

  if (relativeTime.includes('秒')) {
    return '刚刚';
  }

  if (relativeTime.includes('小时')) {
    return '今天 ' + dayjsTime.format('HH:mm');
  }

  return relativeTime;
};

export const openApp = id => {
  if (isIos) {
    lanchApp.open(
      {
        launchType: {
          ios: 'scheme'
        },
        scheme: 'ifigure://' + id,
        pkgs: {
          ios: 'https://itunes.apple.com/cn/app/id1481020811?mt=8'
        },
        landPage: 'https://itunes.apple.com/cn/app/id1481020811?mt=8'
      },
      s => (s ? 0 : 3)
    );
  } else {
    Toast({
      message: 'Android端正在努力开发中…',
      className: 'app-developing'
    });
  }
};
