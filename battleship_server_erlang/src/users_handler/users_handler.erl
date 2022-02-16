%%%-------------------------------------------------------------------
%%% @author Federico Minniti, Tommaso Baldi, Matteo Del Seppia
%%% @copyright (C) 2022, <group_mbds>
%%% @doc
%%%
%%% @end
%%% Created : 07. feb 2022 19:05
%%%-------------------------------------------------------------------
-module(users_handler).
-author("group_mbds").

-export([init_server/0]).

init_server() ->
	Server = self(),
	RandomOpponentPid = spawn( fun() -> random_opponent_daemon(Server, null) end ),
  	BattleShipPid = spawn( fun() -> battleship_daemon(Server, RandomOpponentPid, #{}) end ),
  	server_loop(BattleShipPid, RandomOpponentPid).

% It handles mainly 2 types of interaction: online users' manipulation and search a random user
server_loop(BattleShipPid, RandomOpponentPid) ->
	receive
		{From, {update_online_user, Operation} } ->
			BattleShipPid ! {From, Operation},
			server_loop(BattleShipPid, RandomOpponentPid);
			
		{From, search_random_opponent} ->
			RandomOpponentPid ! {From, search_random_opponent},
			BattleShipPid ! {From, user_in_game},
			server_loop(BattleShipPid, RandomOpponentPid);
			
    	{From, stop} ->
      		BattleShipPid ! {self(), stop},
			RandomOpponentPid ! {self(), stop},
      		From ! {ok};
			
    	_ ->  
      		server_loop(BattleShipPid, RandomOpponentPid)
  	end.

% Random user research: 
% 	1st user is saved and wait for an opponent 
% 	2nd user is matched with the previous user and the demon send the needed message to allow users to start the game  
random_opponent_daemon(Server, User) ->
	receive
		{From, search_random_opponent} ->
			if
				(User == null) -> 
					NewUser = From,
					random_opponent_daemon(Server, NewUser);
				true -> 
					MessageUser = jsx:encode(#{<<"type">> => <<"battleship_accepted">>, <<"sender">> => From}),
					User ! MessageUser,
					MessageFrom = jsx:encode(#{<<"type">> => <<"battleship_accepted">>, <<"sender">> => User}),
					From ! MessageFrom,
					NewUser = null,
					random_opponent_daemon(Server, NewUser)
			end;
			
		{From, stop_search} ->
			if
				(From == User) ->
					NewUser = null;
				true -> 
					io:format("Error on stop random users search\n"),
					NewUser = User
			end,
			random_opponent_daemon(Server, NewUser);
	    {Server, stop} ->
	    	ok
	end.

% Manipulation of online users. We have 3 types of interactions:
%	1 add: a new user is available to send and receive game request -> it is registered in the map and a message is sent to the others 
%		   players to inform them. The initial state is 'in lobby'
%	2 user_in_game: a user start a game with another -> the daemon change the state of the two processes individually and send an update 
%					to the others processes to inform them that it is not available to receive requests and another massage to remove all 
%					the request of the user that started a game
battleship_daemon(Server, RandomOpponentPid, OnlineUsers) ->
	receive
    	{From, add} ->
			UpdatedOnlineUsers = maps:put(From, in_lobby, OnlineUsers),
      	  	send_all(UpdatedOnlineUsers),
      	  	io:format("New user available: ~s\n", [From]),
      	  	io:format("Online users: ~w ~n", [UpdatedOnlineUsers]),
      	  	battleship_daemon(Server, RandomOpponentPid, UpdatedOnlineUsers);
	  
		{From, user_in_game} ->
			UpdatedOnlineUsers = maps:put(From, in_game, OnlineUsers),
			send_all(UpdatedOnlineUsers),
			update_all(UpdatedOnlineUsers, From),
			io:format("~s starts a game\n", [From]),
			battleship_daemon(Server, RandomOpponentPid, UpdatedOnlineUsers);
		
    	{From, remove} ->
			RandomOpponentPid ! {From, stop_search},
      	  	UpdatedOnlineUsers = maps:remove(From, OnlineUsers),
      	  	send_all(UpdatedOnlineUsers),
     	   	update_all(UpdatedOnlineUsers, From),
     	   	io:format("~s is now offline\n", [From]),
    		io:format("Online users: ~w ~n", [UpdatedOnlineUsers]),
    		battleship_daemon(Server, RandomOpponentPid, UpdatedOnlineUsers);
			
    	{Server, stop} ->
     	   	ok;
			
    	_ -> 
			battleship_daemon(Server, RandomOpponentPid, OnlineUsers)
	end.


% Function to extract from the map the list of the 'in lobby' users. After we call the send messages function to update the online users
send_all(Map) ->
	Pred = fun(K,V) -> (V =:= in_lobby) end,
	Filtered = maps:filter(Pred, Map),
	List = maps:keys(Filtered),
  	send_all(List, List).

send_all([], _) -> ok;

% 2 types of messages to send to the online users:
%	updated_online_users: it is used to send the online users' list
%	remove_user_requests: it is used to remove requests of a user that goes offline or a user that started a game
% We discriminates the two cases because in the first case we pass a list and in the second case we pass a single value
send_all([First|Others], Data) ->
  	if
    	(is_list(Data)) ->
      	  	First ! jsx:encode(#{<<"type">> => <<"updated_online_users">>, <<"data">> => Data});
    	true ->
      	  	First ! jsx:encode(#{<<"type">> => <<"remove_user_requests">>, <<"data">> => Data})
  	end,
  	send_all(Others, Data).
  

update_all(Map, From) ->
	Pred = fun(K,V) -> (V =:= in_lobby) end,
	Filtered = maps:filter(Pred, Map),
	List = maps:keys(Filtered),
  	send_all(List, From).
