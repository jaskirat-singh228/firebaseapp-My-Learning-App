import { useNetInfo } from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BaseText from 'components/base_components/base_text';
import BaseTextInput from 'components/base_components/base_text_input';
import CardView from 'components/hoc/card_view';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { BackWithTitleHeader } from 'components/molecules/back_with_title_view';
import BounceView from 'components/molecules/bounce_view';
import {
	addAndReplaceOfflineTodo,
	deleteLocalTodo,
	editLocalTodo,
	getLocalTodos,
	getUnsyncedTodos,
	updateLocalTodos,
} from 'local_storage/SQLite/todosRepository';
import React from 'react';
import { FlatList, TextInput } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { AppStackParamList } from 'types/navigation_types';
import { MaterialIcon } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';
import { showToast } from 'utilities/utils';
import { v4 as UUIDv4 } from 'uuid';

type TodoScreenProps = NativeStackScreenProps<AppStackParamList, 'TodoScreen'>;

export type TTodoData = {
	isSynced: number;
	todo: string;
	todoId: string;
	createdAt: string;
};

const TodoScreen: React.FC<TodoScreenProps> = () => {
	const theme = useTheme();
	const { isConnected } = useNetInfo();
	const inputRef = React.useRef<TextInput>(null);
	const [value, setValue] = React.useState<string>('');
	const [todoList, setTodoList] = React.useState<TTodoData[]>([]);
	const [editTodo, setEditTodo] = React.useState<TTodoData | null>(null);

	const syncTodos = async () => {
		if (isConnected) {
			try {
				const unsyncedTodos = await getUnsyncedTodos();

				for (const todo of unsyncedTodos) {
					try {
						// First, write to Firestore
						await firestore()
							.collection('Todos')
							.doc(todo.todoId)
							.set({
								...todo,
								isSynced: 1,
							});

						// Then, update local DB as synced
						await updateLocalTodos(1, todo.todoId);
					} catch (syncError) {
						console.error(`Error syncing todo ${todo.todo}:`, syncError);
					}
				}
				const snapshot = await firestore().collection('Todos').orderBy('createdAt').get();

				const firebaseTodos: TTodoData[] = snapshot.docs.map((doc) => {
					const data = doc.data();

					return {
						todoId: data.todoId,
						todo: data.todo,
						isSynced: data.isSynced,
						createdAt: data.createdAt,
					};
				});
				setTodoList(firebaseTodos);

				// firebaseTodos for Sqlite
				firebaseTodos.map(async (item) => {
					await addAndReplaceOfflineTodo(item);
				});
			} catch (err) {
				console.error('Failed to sync todos:', err);
			}
		} else {
			const res = await getLocalTodos();
			setTodoList(res.data);
		}
	};

	React.useEffect(() => {
		syncTodos();
	}, [isConnected]);

	const addUpdateTodo = React.useCallback(async () => {
		if (!value.trim()) {
			showToast('Please enter a text!', 'danger');
			return;
		}

		const trimmedValue = value.trim();
		const isEdit = !!editTodo;
		const todoId = isEdit ? editTodo!.todoId : UUIDv4().toString();
		const createdAt = isEdit ? editTodo!.createdAt : new Date().toString();

		const data: TTodoData = {
			todoId,
			todo: trimmedValue,
			isSynced: isConnected ? 1 : 0,
			createdAt,
		};

		try {
			if (isConnected) {
				await firestore().collection('Todos').doc(todoId).set(data);
			}

			if (isEdit) {
				await editLocalTodo(editTodo?.todoId, data);
			} else {
				await addAndReplaceOfflineTodo(data);
			}
			showToast(`Todo ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
			setEditTodo(null);
			setValue('');

			const res = await getLocalTodos();
			setTodoList(res.data);
		} catch (err) {
			console.error(`${isEdit ? 'Update' : 'Add'} failed:`, err);
			showToast('Something went wrong', 'danger');
		}
	}, [isConnected, value, editTodo]);

	const deleteTodo = React.useCallback(
		async (todoId: string) => {
			if (isConnected) {
				await deleteLocalTodo(todoId).then(async (res) => {
					if (res && res !== undefined) {
						showToast(res.message, 'success');
						await getLocalTodos().then((res) => {
							setTodoList(res.data);
						});
					}
				});
				await firestore().collection('Todos').doc(todoId).delete();
				await getLocalTodos().then((res) => {
					setTodoList(res.data);
				});
			} else {
				await deleteLocalTodo(todoId).then(async (res) => {
					if (res && res !== undefined) {
						showToast(res.message, 'success');
						await getLocalTodos().then((res) => {
							setTodoList(res.data);
						});
					}
				});
			}
		},
		[isConnected],
	);

	return (
		<FullScreenContainer>
			<BackWithTitleHeader title='Todos' />
			<BaseTextInput
				ref={inputRef}
				value={value}
				onChangeText={(text) => setValue(text)}
				placeholder='Enter something...'
				autoCapitalize='words'
			/>
			<AnimatedLoaderButton
				title={editTodo ? 'Update' : 'Add'}
				onPress={addUpdateTodo}
				alignSelfCenter
			/>
			{editTodo && (
				<AnimatedLoaderButton
					title='Cancel Edit'
					onPress={() => {
						setEditTodo(null);
						setValue('');
					}}
					alignSelfCenter
					buttonColor={theme.colors.error}
				/>
			)}
			<FlatList
				data={todoList}
				contentContainerStyle={{
					paddingHorizontal: ms(15),
					paddingBottom: ms(100),
				}}
				style={{ paddingTop: ms(10), marginTop: ms(10) }}
				keyExtractor={(item: TTodoData) => item.todoId.toString()}
				renderItem={({ item }: { item: TTodoData }) => {
					return (
						<CardView
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<BaseText
								numberOfLines={2}
								style={{ fontSize: 16, padding: ms(10), width: '80%' }}
							>
								{item.todo}
							</BaseText>
							<BounceView
								onPress={() => {
									setEditTodo(item);
									setValue(item.todo);
									setTimeout(() => {
										inputRef.current?.focus();
									}, 100);
								}}
							>
								<Icon
									source={MaterialIcon.PENCIL_OULINE}
									size={25}
									color={theme.colors.backdrop}
								/>
							</BounceView>
							<BounceView onPress={() => deleteTodo(item.todoId)}>
								<Icon
									source={MaterialIcon.DELETE}
									size={25}
									color={theme.colors.error}
								/>
							</BounceView>
						</CardView>
					);
				}}
			/>
		</FullScreenContainer>
	);
};

export default TodoScreen;
