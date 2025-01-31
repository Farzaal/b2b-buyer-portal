import { ReactNode, useContext, useEffect, useLayoutEffect } from 'react';

import { GlobaledContext } from '@/shared/global';
import { getBCStoreChannelId } from '@/shared/service/b2b';
import { getGlobalTranslations, setStoreInfo, setTimeFormat, useAppDispatch } from '@/store';

import B3PageMask from './loading/B3PageMask';
import showPageMask from './loading/B3showPageMask';

interface B3StoreContainerProps {
  children: ReactNode;
}

export interface StoreItem {
  channelId: number;
  urls: Array<string>;
  b2bEnabled: boolean;
  channelLogo: string;
  isEnabled: boolean;
  b3ChannelId: number;
  type: string;
  platform: string;
  translationVersion: number;
}

export interface StoreBasicInfo {
  storeSites?: Array<StoreItem> | [];
  storeName: string;
}

export default function B3StoreContainer(props: B3StoreContainerProps) {
  const {
    state: { storeEnabled },
    dispatch,
  } = useContext(GlobaledContext);
  const storeDispatch = useAppDispatch();

  // getBCStoreChannelId()
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log('Error ', err));
    
  useEffect(() => {
    const getStoreBasicInfo = async () => {
      if (
        window.location.pathname.includes('account.php') ||
        (window.location.hash && window.location.hash !== '#/')
      ) {
        showPageMask(dispatch, true);
      }

      try {
        const { storeBasicInfo }: CustomFieldItems = await getBCStoreChannelId();
        const [storeInfo] = storeBasicInfo.storeSites;

        if (!storeInfo) return;

        storeDispatch(setStoreInfo(storeInfo));

        const {
          channelId,
          b3ChannelId: b2bChannelId,
          b2bEnabled: storeEnabled,
          translationVersion,
        } = storeInfo;

        const isEnabled = storeBasicInfo?.multiStorefrontEnabled ? storeEnabled : true;

        dispatch({
          type: 'common',
          payload: {
            storeEnabled: isEnabled,
            b2bChannelId,
            storeName: storeBasicInfo.storeName,
            multiStorefrontEnabled: storeBasicInfo.multiStorefrontEnabled,
          },
        });

        if (!isEnabled) {
          showPageMask(dispatch, false);
        }

        storeDispatch(
          getGlobalTranslations({
            newVersion: translationVersion,
            channelId: storeBasicInfo.multiStorefrontEnabled ? channelId : 0,
          }),
        );

        storeDispatch(setTimeFormat(storeBasicInfo.timeFormat));
        sessionStorage.setItem('currentB2BEnabled', JSON.stringify(isEnabled));
      } catch (error) {
        showPageMask(dispatch, false);
      }
    };
    getStoreBasicInfo();
    // disabling because dispatchers are not supposed to be here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { children } = props;
  console.log("storeEnabled === > ", storeEnabled)
  return (
    <>
      {children}
      <B3PageMask />
    </>
  );
}
