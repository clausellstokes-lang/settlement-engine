import getSideChannelList from 'https://esm.sh/side-channel-list@1.0.1/index.d.ts';
import getSideChannelMap from 'https://esm.sh/side-channel-map@1.0.1/index.d.ts';
import getSideChannelWeakMap from 'https://esm.sh/side-channel-weakmap@1.0.2/index.d.ts';

declare namespace getSideChannel {
	type Channel<K, V> =
		| getSideChannelList.Channel<K, V>
		| ReturnType<Exclude<typeof getSideChannelMap<K, V>, false>>
		| ReturnType<Exclude<typeof getSideChannelWeakMap<K, V>, false>>;
}

declare function getSideChannel<K, V>(): getSideChannel.Channel<K, V>;

export = getSideChannel;
